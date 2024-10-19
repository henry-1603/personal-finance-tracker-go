package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"finance-tracker/config"
	"finance-tracker/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
    "go.mongodb.org/mongo-driver/bson/primitive" // Import this line
	"github.com/dgrijalva/jwt-go" // Ensure this package is imported
	"time"
)

// Secret key for signing the JWT token
var jwtSecret = []byte("your_secret_key") // Use a strong secret key

func RegisterUser(w http.ResponseWriter, r *http.Request) {
    var user models.User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, "Invalid request payload", http.StatusBadRequest)
        return
    }

    // Check if the email already exists
    collection := config.DB.Collection("users")
    var existingUser models.User
    err := collection.FindOne(context.TODO(), bson.M{"email": user.Email}).Decode(&existingUser)
    if err == nil {
        http.Error(w, "Email already registered", http.StatusConflict) // 409 Conflict
        return
    } else if err.Error() != "mongo: no documents in result" {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    user.Password = string(hashedPassword)

    // Insert new user and capture the inserted ID
    result, err := collection.InsertOne(context.TODO(), user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Retrieve the generated ID
    if oid, ok := result.InsertedID.(primitive.ObjectID); ok {
        user.ID = oid // Directly assign the ObjectID
    } else {
        http.Error(w, "Error retrieving user ID", http.StatusInternalServerError)
        return
    }

    // Generate a token after user creation
    token, err := generateToken(user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Create a response struct
    response := struct {
        Message string      `json:"message"`
        Token   string      `json:"token"`
        User    models.User `json:"user"`
    }{
        Message: "User Created Successfully",
        Token:   token,
        User:    user,
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(response)
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
    var input struct {
        UsernameOrEmail string `json:"usernameOrEmail"`
        Password        string `json:"password"`
    }

    // Decode the request body
    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    collection := config.DB.Collection("users")
    var dbUser models.User

    // Check if the input is a username or email and search accordingly
    err := collection.FindOne(context.TODO(), bson.M{
        "$or": []bson.M{
            {"username": input.UsernameOrEmail},
            {"email": input.UsernameOrEmail},
        },
    }).Decode(&dbUser)

    if err != nil {
        http.Error(w, "User not found", http.StatusUnauthorized)
        return
    }

    // Compare the hashed password
    err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(input.Password))
    if err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // Generate a token
    token, err := generateToken(dbUser)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // Create a response struct
    response := struct {
        Message string      `json:"message"`
        Token   string      `json:"token"`
        User    models.User `json:"user"`
    }{
        Message: "Login Successfully",
        Token:   token,
        User:    dbUser,
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(response)
}


// Function to generate JWT token
func generateToken(user models.User) (string, error) {
    claims := jwt.MapClaims{
        "id":        user.ID.Hex(),          // Store the user ID as a string
        "username":  user.Username,          // Include username
        "email":     user.Email,             // Include email
        "createdAt": user.CreatedAt,         // Include creation timestamp
        "updatedAt": user.UpdatedAt,         // Include update timestamp
        "exp":       time.Now().Add(time.Hour * 24).Unix(), // Token expiration time (24 hours)
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
}
