package main

import (
	"finance-tracker/config"
	"log"
	"net/http"
	"finance-tracker/internal/handlers"
	"github.com/joho/godotenv"

)

func init() {
    err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
}

func main() {

	
	config.ConnectDB()
	
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to the Personal Finance Tracker!"))
	})

	// user 
	http.HandleFunc("/register", handlers.RegisterUser)
	http.HandleFunc("/login", handlers.LoginUser)

	//  budget
	http.HandleFunc("/api/budgets/create", handlers.CreateBudget)
    http.HandleFunc("/api/budgets/user", handlers.GetBudgetsByUser)
    http.HandleFunc("/api/budgets/update", handlers.UpdateBudget)
    http.HandleFunc("/api/budgets/delete", handlers.DeleteBudget)


	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
