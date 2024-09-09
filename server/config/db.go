package config

import (
    "context"
    "log"
    "os"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Database

func ConnectDB() {
    // Read the connection string from environment variables
    connectionString := os.Getenv("MONGODB_URI")
    if connectionString == "" {
        connectionString = "mongodb+srv://henilsuhagiya1603:henil16303@gofinance.zerpq.mongodb.net/"
    }

    // Set client options and connect
    clientOptions := options.Client().ApplyURI(connectionString)
    client, err := mongo.Connect(context.TODO(), clientOptions)
    if err != nil {
        log.Fatal(err)
    }

    // Ping the database to verify connection
    err = client.Ping(context.TODO(), nil)
    if err != nil {
        log.Fatal(err)
    }

    // Set the global DB variable
    DB = client.Database("GoFinance")

    log.Println("Connected to MongoDB!")
    log.Println(os.Getenv("MONGODB_URI"))

}
