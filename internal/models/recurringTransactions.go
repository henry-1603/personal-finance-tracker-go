package models

import (
    "go.mongodb.org/mongo-driver/bson/primitive"
    "time"
)

type RecurringTransaction struct {
    ID             primitive.ObjectID `bson:"_id,omitempty"`
    UserID         primitive.ObjectID `bson:"user_id"`
    Type           string             `bson:"type"` // "expense" or "income"
    Category       string             `bson:"category"`
    Amount         float64            `bson:"amount"`
    Interval       string             `bson:"interval"` // e.g., "monthly", "weekly"
    NextOccurrence time.Time          `bson:"next_occurrence"`
    CreatedAt      time.Time          `bson:"created_at"`
    UpdatedAt      time.Time          `bson:"updated_at"`
}
