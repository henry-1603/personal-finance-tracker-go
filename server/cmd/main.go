package main

import (
	"finance-tracker/config"
	"finance-tracker/internal/handler"
	"github.com/gorilla/handlers"
	"github.com/joho/godotenv"
	"log"
	"net/http"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	config.ConnectDB()

	mux := http.NewServeMux()

	// Set up CORS
	corsObj := handlers.AllowedOrigins([]string{"*"})
	corsHeaders := handlers.AllowedHeaders([]string{"Content-Type", "Authorization"})
	corsMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})

	// Welcome route
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to the Personal Finance Tracker!"))
	})

	// User routes
	mux.HandleFunc("/register", methodHandler(handler.RegisterUser, "POST"))
	mux.HandleFunc("/login", methodHandler(handler.LoginUser, "POST"))

	// Budget routes
	mux.HandleFunc("/api/budgets/create", methodHandler(handler.CreateBudget, "POST"))
	mux.HandleFunc("/api/budgets/user", methodHandler(handler.GetBudgetsByUser, "GET"))
	mux.HandleFunc("/api/budgets/update", methodHandler(handler.UpdateBudget, "PUT"))
	mux.HandleFunc("/api/budgets/delete", methodHandler(handler.DeleteBudget, "DELETE"))

	// Expense routes
	mux.HandleFunc("/expenses", methodHandler(handler.CreateExpense, "POST"))
	mux.HandleFunc("/expenses/", methodHandler(handler.DeleteExpense, "DELETE")) // Note the trailing slash
	mux.HandleFunc("/expenses/user", methodHandler(handler.GetExpensesByUser, "GET"))
	mux.HandleFunc("/categories", methodHandler(handler.GetExpenseCategories, "GET"))
	mux.HandleFunc("/budgets/expense", methodHandler(handler.SetExpenseLimit, "POST"))

	// Income routes
	mux.HandleFunc("/income/user", methodHandler(handler.GetIncomeByUser, "GET"))
	mux.HandleFunc("/income/create", methodHandler(handler.CreateIncome, "POST"))
	mux.HandleFunc("/income/update", methodHandler(handler.UpdateIncome, "PUT"))
	mux.HandleFunc("/income/delete", methodHandler(handler.DeleteIncome, "DELETE"))

	// Recurring transactions routes
	mux.HandleFunc("/api/recurrTransac/create", methodHandler(handler.CreateRecurringTransaction, "POST"))
	mux.HandleFunc("/api/recurrTransac/update", methodHandler(handler.UpdateRecurringTransaction, "PUT"))
	mux.HandleFunc("/api/recurrTransac/delete", methodHandler(handler.DeleteRecurringTransaction, "DELETE"))
	mux.HandleFunc("/api/recurrTransac/user", methodHandler(handler.GetRecurringTransactionsByUser, "GET"))

	// Account routes
	mux.HandleFunc("/api/accounts/create", methodHandler(handler.CreateAccount, "POST"))
	mux.HandleFunc("/api/accounts/update", methodHandler(handler.UpdateAccount, "PUT"))
	mux.HandleFunc("/api/accounts/delete", methodHandler(handler.DeleteAccount, "DELETE"))
	mux.HandleFunc("/api/accounts/user", methodHandler(handler.GetAccountsByUser, "GET"))

	// Start server with CORS
	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(corsObj, corsHeaders, corsMethods)(mux)))
}

func methodHandler(handler http.HandlerFunc, methods ...string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		for _, method := range methods {
			if r.Method == method {
				handler(w, r)
				return
			}
		}
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
