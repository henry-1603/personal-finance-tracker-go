package handler

import (
	"context"
	"encoding/json"
	"finance-tracker/config"
	"finance-tracker/internal/models"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateExpense(w http.ResponseWriter, r *http.Request) {
	var expense models.Expense
	if err := json.NewDecoder(r.Body).Decode(&expense); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	expense.ID = primitive.NewObjectID()
	expense.UserID, _ = primitive.ObjectIDFromHex(r.Header.Get("user_id")) // Assuming user_id is passed in the header
	expense.Date = time.Now()

	collection := config.DB.Collection("expenses")
	_, err := collection.InsertOne(context.TODO(), expense)
	if err != nil {
		http.Error(w, "Failed to create expense", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(expense)
}

func UpdateExpense(w http.ResponseWriter, r *http.Request) {
	var expense models.Expense
	if err := json.NewDecoder(r.Body).Decode(&expense); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	expenseID := r.URL.Query().Get("expense_id")
	expenseIDObj, err := primitive.ObjectIDFromHex(expenseID)
	if err != nil {
		http.Error(w, "Invalid Expense ID", http.StatusBadRequest)
		return
	}

	filter := bson.M{"_id": expenseIDObj}
	update := bson.M{"$set": expense}

	collection := config.DB.Collection("expenses")
	_, err = collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		http.Error(w, "Failed to update expense", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Expense updated successfully"))
}

func DeleteExpense(w http.ResponseWriter, r *http.Request) {
	expenseID := r.URL.Query().Get("expense_id")
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
	userID := r.Header.Get("user_id")
	userIDObj, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid User ID", http.StatusBadRequest)
		return
	}

	category := r.URL.Query().Get("category") // Optional filter by category

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
