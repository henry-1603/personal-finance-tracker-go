package handlers

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

func CreateRecurringTransaction(w http.ResponseWriter, r *http.Request) {
	var transaction models.RecurringTransaction
	if err := json.NewDecoder(r.Body).Decode(&transaction); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	transaction.ID = primitive.NewObjectID() // Generate a new ObjectID for the income

	transaction.NextOccurrence = calculateNextOccurrence(transaction.Interval)

	collection := config.DB.Collection("recurring_transactions")
	_, err := collection.InsertOne(context.TODO(), transaction)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(transaction)
}

func UpdateRecurringTransaction(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Transaction ID is required", http.StatusBadRequest)
		return
	}

	transactionID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid Transaction ID", http.StatusBadRequest)
		return
	}

	var updatedTransaction models.RecurringTransaction
	if err := json.NewDecoder(r.Body).Decode(&updatedTransaction); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Prepare update fields
	updateFields := bson.M{}
	if updatedTransaction.Type != "" {
		updateFields["type"] = updatedTransaction.Type
	}
	if updatedTransaction.Amount != 0 {
		updateFields["amount"] = updatedTransaction.Amount
	}
	if updatedTransaction.Interval != "" {
		updateFields["interval"] = updatedTransaction.Interval
		
		updatedTransaction.NextOccurrence = calculateNextOccurrence(updatedTransaction.Interval)
		log.Println(updatedTransaction.NextOccurrence)
		updateFields["next_occurrence"] = updatedTransaction.NextOccurrence
	}
	if updatedTransaction.NextOccurrence != "" {
		updateFields["next_occurrence"] = updatedTransaction.NextOccurrence
	}

	if len(updateFields) == 0 {
		http.Error(w, "No fields to update", http.StatusBadRequest)
		return
	}

	collection := config.DB.Collection("recurring_transactions")
	filter := bson.M{"_id": transactionID}
	update := bson.M{"$set": updateFields}

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if result.MatchedCount == 0 {
		http.Error(w, "Transaction not found", http.StatusNotFound)
		return
	}

	// Retrieve and return the updated record
	var updatedRecord models.RecurringTransaction
	err = collection.FindOne(context.TODO(), filter).Decode(&updatedRecord)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedRecord)
}

func DeleteRecurringTransaction(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Transaction ID is required", http.StatusBadRequest)
		return
	}

	transactionID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid Transaction ID", http.StatusBadRequest)
		return
	}

	collection := config.DB.Collection("recurring_transactions")
	result, err := collection.DeleteOne(context.TODO(), bson.M{"_id": transactionID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Transaction not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Delete successful"))
}

func GetRecurringTransactionsByUser(w http.ResponseWriter, r *http.Request) {
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

	collection := config.DB.Collection("recurring_transactions")
	cursor, err := collection.Find(context.TODO(), bson.M{"user_id": userIDObj})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var transactions []models.RecurringTransaction
	if err = cursor.All(context.TODO(), &transactions); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(transactions)
}

func ProcessRecurringTransactions() {
	collection := config.DB.Collection("recurring_transactions")

	now := time.Now().UTC().Format(time.RFC3339) // Current time in RFC3339 format

	// Find transactions that are due for the current date
	cursor, err := collection.Find(context.TODO(), bson.M{
		"next_occurrence": bson.M{"$lte": now},
	})
	if err != nil {
		log.Println("Error finding recurring transactions:", err)
		return
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var transaction models.RecurringTransaction
		if err := cursor.Decode(&transaction); err != nil {
			log.Println("Error decoding transaction:", err)
			continue
		}

		// Process the transaction based on its type (Expense or Income)
		// e.g., create a new expense or income record

		// Update the NextOccurrence field
		nextOccurrence := calculateNextOccurrence(transaction.Interval)
		_, err := collection.UpdateOne(
			context.TODO(),
			bson.M{"_id": transaction.ID},
			bson.M{"$set": bson.M{"next_occurrence": nextOccurrence}},
		)
		if err != nil {
			log.Println("Error updating next occurrence:", err)
		}
	}
}

func calculateNextOccurrence(interval string) string {
	now := time.Now().UTC()
	var nextOccurrence time.Time

	switch interval {
	case "weekly":
		nextOccurrence = now.AddDate(0, 0, 7) // Add 7 days for weekly recurrence
	case "monthly":
		nextOccurrence = now.AddDate(0, 1, 0) // Add 1 month for monthly recurrence
	default:
		return "Invalid interval"
	}

	// Return the next occurrence in ISO 8601 format
	return nextOccurrence.Format(time.RFC3339)
}
