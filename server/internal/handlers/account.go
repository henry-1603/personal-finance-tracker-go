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


func CreateAccount(w http.ResponseWriter, r *http.Request) {
    var account models.Account
    if err := json.NewDecoder(r.Body).Decode(&account); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    account.ID = primitive.NewObjectID() // Generate a new ObjectID for the account
    collection := config.DB.Collection("accounts")

    _, err := collection.InsertOne(context.TODO(), account)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(account)
}



func UpdateAccount(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    if id == "" {
        http.Error(w, "Account ID is required", http.StatusBadRequest)
        return
    }

    accountID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        http.Error(w, "Invalid Account ID", http.StatusBadRequest)
        return
    }

    var updatedAccount models.Account
    if err := json.NewDecoder(r.Body).Decode(&updatedAccount); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    updateFields := bson.M{}
    if updatedAccount.AccountType != "" {
        updateFields["account_type"] = updatedAccount.AccountType
    }
    if updatedAccount.Balance != 0 {
        updateFields["balance"] = updatedAccount.Balance
    }
    if updatedAccount.Currency != "" {
        updateFields["currency"] = updatedAccount.Currency
    }

    if len(updateFields) == 0 {
        http.Error(w, "No fields to update", http.StatusBadRequest)
        return
    }

    collection := config.DB.Collection("accounts")
    filter := bson.M{"_id": accountID}
    update := bson.M{"$set": updateFields}

    result, err := collection.UpdateOne(context.TODO(), filter, update)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if result.MatchedCount == 0 {
        http.Error(w, "Account not found", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(updatedAccount)
}


func DeleteAccount(w http.ResponseWriter, r *http.Request) {
    id := r.URL.Query().Get("id")
    if id == "" {
        http.Error(w, "Account ID is required", http.StatusBadRequest)
        return
    }

    accountID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        http.Error(w, "Invalid Account ID", http.StatusBadRequest)
        return
    }

    collection := config.DB.Collection("accounts")
    result, err := collection.DeleteOne(context.TODO(), bson.M{"_id": accountID})
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if result.DeletedCount == 0 {
        http.Error(w, "Account not found", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Account deleted successfully"))
}


func GetAccountsByUser(w http.ResponseWriter, r *http.Request) {
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

    collection := config.DB.Collection("accounts")
    cursor, err := collection.Find(context.TODO(), bson.M{"user_id": userIDObj})
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer cursor.Close(context.TODO())

    var accounts []models.Account
    if err := cursor.All(context.TODO(), &accounts); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(accounts)
}
