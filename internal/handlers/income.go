package handlers

import (
	"context"
	"encoding/json"
	"finance-tracker/config"
	"finance-tracker/internal/models"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateIncome(w http.ResponseWriter, r *http.Request) {
    var income models.Income
    if err := json.NewDecoder(r.Body).Decode(&income); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    income.ID = primitive.NewObjectID() // Generate a new ObjectID for the income

    collection := config.DB.Collection("income")
    _, err := collection.InsertOne(context.TODO(), income)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(income)
}

func UpdateIncome(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
    if id == "" {
        http.Error(w, "Income ID is required", http.StatusBadRequest)
        return
    }

    incomeID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        http.Error(w, "Invalid Income ID", http.StatusBadRequest)
        return
    }

    var updatedIncome models.Income
    if err := json.NewDecoder(r.Body).Decode(&updatedIncome); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

	updateFields := bson.M{}
    if updatedIncome.Source != "" {
        updateFields["source"] = updatedIncome.Source
    }
    if updatedIncome.Amount != 0 {
        updateFields["amount"] = updatedIncome.Amount
    }
    if !updatedIncome.Date.IsZero() {
        updateFields["date"] = updatedIncome.Date
    }
    if updatedIncome.Description != "" {
        updateFields["description"] = updatedIncome.Description
    }

    if len(updateFields) == 0 {
        http.Error(w, "No fields to update", http.StatusBadRequest)
        return
    }


    collection := config.DB.Collection("income")
	filter := bson.M{"_id":incomeID}
	update := bson.M{"$set": updateFields}


	result, err := collection.UpdateOne(context.TODO(), filter, update)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if result.MatchedCount == 0 {
        http.Error(w, "Budget not found", http.StatusNotFound)
        return
    }

    // Optionally retrieve and return the updated record
    var updatedRecord models.Budget
    err = collection.FindOne(context.TODO(), filter).Decode(&updatedRecord)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(updatedRecord)
}


func DeleteIncome(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    if id == "" {
        http.Error(w, "Income ID is required", http.StatusBadRequest)
        return
    }

    incomeID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        http.Error(w, "Invalid Income ID", http.StatusBadRequest)
        return
    }

    collection := config.DB.Collection("income")
    _, err = collection.DeleteOne(context.TODO(), bson.M{"_id": incomeID})
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    } else {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Income deleted successfully"))
	}

	
}


func GetIncomeByUser(w http.ResponseWriter, r *http.Request) {
    userID := r.URL.Query().Get("user_id")
    if userID == "" {
        http.Error(w, "User ID is required", http.StatusBadRequest)
        return
    }

    userIDObj, err := primitive.ObjectIDFromHex(userID)
    if err != nil {
        http.Error(w, "Invalid User ID", http.StatusBadRequest)
        return
    }

    collection := config.DB.Collection("income")
    cursor, err := collection.Find(context.TODO(), bson.M{"user_id": userIDObj})
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.TODO())

    var incomes []models.Income
    if err = cursor.All(context.TODO(), &incomes); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(incomes)
}
