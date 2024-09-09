package models

import (
    "go.mongodb.org/mongo-driver/bson/primitive"
    "time"
)

type AccountManagement struct {
    ID        primitive.ObjectID `bson:"_id,omitempty"`
    UserID    primitive.ObjectID `bson:"user_id"`
    AccountType string           `bson:"account_type"` // e.g., "checking", "savings"
    Balance   float64            `bson:"balance"`
    Currency  string             `bson:"currency"`
    CreatedAt time.Time          `bson:"created_at"`
    UpdatedAt time.Time          `bson:"updated_at"` 
}
