package models

import (
    "go.mongodb.org/mongo-driver/bson/primitive"
    "time"
)

type Goal struct {
    ID            primitive.ObjectID `bson:"_id,omitempty"`
    UserID        primitive.ObjectID `bson:"user_id"`
    GoalName      string             `bson:"goal_name"`
    TargetAmount  float64            `bson:"target_amount"`
    CurrentAmount float64            `bson:"current_amount"`
    Deadline      time.Time          `bson:"deadline"`
    CreatedAt     time.Time          `bson:"created_at"`
    UpdatedAt     time.Time          `bson:"updated_at"`
}
