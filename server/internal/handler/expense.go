package handler

import (
	"context"
	"encoding/json"
	"finance-tracker/config"
	"finance-tracker/internal/models"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreateExpenseRequest struct {
	Category    string  `json:"category"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description,omitempty"`
	UserID      string  `json:"user_id"` // Add UserID field to match the body structure
}

func CreateExpense(w http.ResponseWriter, r *http.Request) {
	var req CreateExpenseRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	expense := models.Expense{
		ID:          primitive.NewObjectID(),
		Category:    req.Category,
		Amount:      req.Amount,
		Description: req.Description,
		Date:        time.Now(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Convert UserID from string to ObjectID
	var err error
	expense.UserID, err = primitive.ObjectIDFromHex(req.UserID)
	if err != nil {
		http.Error(w, "Invalid User ID format", http.StatusBadRequest)
		return
	}

	collection := config.DB.Collection("expenses")
	_, err = collection.InsertOne(context.TODO(), expense)
	if err != nil {
		http.Error(w, "Failed to create expense", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(expense)
}


func UpdateExpense(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("expense_id")
	if id == "" {
		http.Error(w, "Expense ID is required", http.StatusBadRequest)
		return
	}

	expenseID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid Expense ID", http.StatusBadRequest)
		return
	}

	var updatedExpense models.Expense
	if err := json.NewDecoder(r.Body).Decode(&updatedExpense); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	updateFields := bson.M{}
	if updatedExpense.Category != "" {
		updateFields["category"] = updatedExpense.Category
	}
	if updatedExpense.Amount != 0 {
		updateFields["amount"] = updatedExpense.Amount
	}
	if !updatedExpense.Date.IsZero() {
		updateFields["date"] = updatedExpense.Date
	}
	if updatedExpense.Description != "" {
		updateFields["description"] = updatedExpense.Description
	}

	if len(updateFields) == 0 {
		http.Error(w, "No fields to update", http.StatusBadRequest)
		return
	}

	collection := config.DB.Collection("expenses")
	filter := bson.M{"_id": expenseID}
	update := bson.M{"$set": updateFields}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Expense not found", http.StatusNotFound)
		return
	}

	// Optionally retrieve and return the updated record
	var updatedRecord models.Expense
	err = collection.FindOne(context.TODO(), filter).Decode(&updatedRecord)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedRecord)
}


func DeleteExpense(w http.ResponseWriter, r *http.Request) {
	expenseID := r.URL.Query().Get("expense_id")
	log.Println(expenseID)
	expenseIDObj, err := primitive.ObjectIDFromHex(expenseID)
	if err != nil {
		http.Error(w, "Invalid Expense ID", http.StatusBadRequest)
		return
	}

	filter := bson.M{"_id": expenseIDObj}

	collection := config.DB.Collection("expenses")
	_, err = collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Failed to delete expense", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Expense deleted successfully"))
}

func GetExpensesByUser(w http.ResponseWriter, r *http.Request) {
    // Get user_id from query parameters
    userID := r.URL.Query().Get("user_id")
    userIDObj, err := primitive.ObjectIDFromHex(userID)
    if err != nil {
        http.Error(w, "Invalid User ID", http.StatusBadRequest)
        return
    }

    category := r.URL.Query().Get("category") // Optional filter by category

    // Create a filter for MongoDB
    filter := bson.M{"user_id": userIDObj}
    if category != "" {
        filter["category"] = category
    }

    collection := config.DB.Collection("expenses")
    cursor, err := collection.Find(context.TODO(), filter)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.TODO())

    var expenses []models.Expense
    if err := cursor.All(context.TODO(), &expenses); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(expenses)
}


func GetExpenseCategories(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("user_id")
	userIDObj, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	collection := config.DB.Collection("expenses")
	pipeline := []bson.M{
		{"$match": bson.M{"user_id": userIDObj}},
		{"$group": bson.M{"_id": "$category"}},
	}

	cursor, err := collection.Aggregate(context.TODO(), pipeline)
	if err != nil {
		http.Error(w, "Failed to retrieve categories", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var categories []string
	for cursor.Next(context.TODO()) {
		var result bson.M
		cursor.Decode(&result)
		categories = append(categories, result["_id"].(string))
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(categories)
}

func SetExpenseLimit(w http.ResponseWriter, r *http.Request) {
	var budget models.Budget
	if err := json.NewDecoder(r.Body).Decode(&budget); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	budget.UserID, _ = primitive.ObjectIDFromHex(r.Header.Get("user_id"))
	budget.ID = primitive.NewObjectID()

	collection := config.DB.Collection("budgets")
	_, err := collection.InsertOne(context.TODO(), budget)
	if err != nil {
		http.Error(w, "Failed to set expense limit", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(budget)
}
