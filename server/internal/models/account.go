package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// Account represents a bank or financial account.
type Account struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`                 // Unique identifier for the account
	UserID      primitive.ObjectID `json:"user_id,omitempty" bson:"user_id,omitempty"`        // Reference to the user who owns the account
	AccountType string             `json:"account_type,omitempty" bson:"account_type,omitempty"` // Type of the account (e.g., checking, savings)
	Balance     float64            `json:"balance,omitempty" bson:"balance,omitempty"`        // Current balance in the account
	Currency    string             `json:"currency,omitempty" bson:"currency,omitempty"`      // Currency type (e.g., USD, EUR)
	CreatedAt time.Time          `bson:"created_at"`
    UpdatedAt time.Time          `bson:"updated_at"` 
}
