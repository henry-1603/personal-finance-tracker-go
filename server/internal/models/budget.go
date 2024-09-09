package models

import (
    "go.mongodb.org/mongo-driver/bson/primitive"
        "time"    
    )

type Budget struct {
    ID       primitive.ObjectID `bson:"_id,omitempty"`
    UserID   primitive.ObjectID `bson:"user_id"`
    Category string             `bson:"category"`
    Limit    float64            `bson:"limit"`
    CreatedAt time.Time          `bson:"created_at"`
    UpdatedAt time.Time          `bson:"updated_at"`
}
