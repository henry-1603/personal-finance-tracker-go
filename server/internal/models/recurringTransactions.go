package models

import( "go.mongodb.org/mongo-driver/bson/primitive"
"time")

type RecurringTransaction struct {
    ID              primitive.ObjectID `bson:"_id,omitempty"`
    UserID          primitive.ObjectID `bson:"user_id"`
    Type            string             `bson:"type"` // "Expense" or "Income"
    Amount          float64            `bson:"amount"`
    Interval        string             `bson:"interval"` // e.g., "monthly", "weekly"
    NextOccurrence  string             `bson:"next_occurrence"` // Date in ISO format
    CreatedAt   time.Time          `bson:"created_at"`
    UpdatedAt   time.Time          `bson:"updated_at"`
}


/*

{
  "ID": "ObjectId",
  "UserID": "ObjectId",
  "Type": "string",        // "Expense" or "Income"
  "Amount": "float64",
  "Interval": "string",    // e.g., "monthly", "weekly"
  "NextOccurrence": "date" // Date of the next scheduled occurrence
}

*/
