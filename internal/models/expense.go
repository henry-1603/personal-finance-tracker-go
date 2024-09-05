package models

import (
    "go.mongodb.org/mongo-driver/bson/primitive"
    "time"
)

type Expense struct {
    ID          primitive.ObjectID `bson:"_id,omitempty"`
    UserID      primitive.ObjectID `bson:"user_id"`
    Category    string             `bson:"category"`
    Amount      float64            `bson:"amount"`
    Date        time.Time          `bson:"date"`
    Description string             `bson:"description,omitempty"`
    CreatedAt   time.Time          `bson:"created_at"`
    UpdatedAt   time.Time          `bson:"updated_at"`
}
