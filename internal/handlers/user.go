package handlers

import (
    "context"
    "encoding/json"
    "net/http"
    "finance-tracker/config"
    "finance-tracker/internal/models"
    "go.mongodb.org/mongo-driver/bson"
    "golang.org/x/crypto/bcrypt"
)


func RegisterUser(w http.ResponseWriter, r *http.Request) {
    var user models.User
    _ = json.NewDecoder(r.Body).Decode(&user)

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    user.Password = string(hashedPassword)

    collection := config.DB.Collection("users")
    _, err = collection.InsertOne(context.TODO(), user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
    w.Write([]byte("User Created Successfully"))
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
    var user models.User
    _ = json.NewDecoder(r.Body).Decode(&user)

    collection := config.DB.Collection("users")
    var dbUser models.User
    err := collection.FindOne(context.TODO(), bson.M{"username": user.Username}).Decode(&dbUser)
    if err != nil {
        http.Error(w, "User not found", http.StatusUnauthorized)
        return
    }

    err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password))
    if err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    w.Write([]byte("Login Successfully"))

    // Generate and return JWT token (code not shown here)

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(dbUser)
}
