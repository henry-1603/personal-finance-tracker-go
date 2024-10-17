package handler

import (
	"context"
	"encoding/json"
	"finance-tracker/config"
	"finance-tracker/internal/models"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateBudget(w http.ResponseWriter, r *http.Request) {
    var budget models.Budget
    // Decode the request body into the Budget struct
    if err := json.NewDecoder(r.Body).Decode(&budget); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Ensure user_id is a valid ObjectID
    userIDObj, err := primitive.ObjectIDFromHex(budget.UserID.Hex())
    if err != nil {
        http.Error(w, "Invalid User ID", http.StatusBadRequest)
        return
    }

    budget.UserID = userIDObj // Assign the converted ObjectID to budget

    // Generate a new ObjectID for the budget
    budget.ID = primitive.NewObjectID()

    // Access the collection and insert the new budget
    collection := config.DB.Collection("budgets")
    _, err = collection.InsertOne(context.TODO(), budget)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Respond with the created budget
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(budget)
}

func GetBudgetsByUser(w http.ResponseWriter, r *http.Request) {
    userID := r.URL.Query().Get("userId")
    userIDObj, err := primitive.ObjectIDFromHex(userID)
    if err != nil {
        http.Error(w, "Invalid User ID", http.StatusBadRequest)
        return
    }

    collection := config.DB.Collection("budgets")
    cursor, err := collection.Find(context.TODO(), bson.M{"user_id": userIDObj})
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.TODO())

    var budgets []models.Budget
    if err = cursor.All(context.TODO(), &budgets); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(budgets)
}



func UpdateBudget(w http.ResponseWriter, r *http.Request) {
    var budget models.Budget
    if err := json.NewDecoder(r.Body).Decode(&budget); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if budget.ID.IsZero() {
        http.Error(w, "Budget ID is required", http.StatusBadRequest)
        return
    }

    collection := config.DB.Collection("budgets")
    filter := bson.M{"_id": budget.ID}
    update := bson.M{"$set": budget}

    _, err := collection.UpdateOne(context.TODO(), filter, update)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(budget)
}


func DeleteBudget(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    if id == "" {
        http.Error(w, "Budget ID is required", http.StatusBadRequest)
        return
    }

    idObj, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        http.Error(w, "Invalid Budget ID", http.StatusBadRequest)
        return
    }

    collection := config.DB.Collection("budgets")
    _, err = collection.DeleteOne(context.TODO(), bson.M{"_id": idObj})
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Budget deleted successfully"))
}
