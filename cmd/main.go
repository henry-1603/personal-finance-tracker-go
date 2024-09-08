package main

import (
	"finance-tracker/config"
	"finance-tracker/internal/handlers"
	"log"
	"net/http"

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

	mux := http.NewServeMux()

	// Welcome route
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Welcome to the Personal Finance Tracker!"))
	})

	// User routes
	mux.HandleFunc("/register", methodHandler(handlers.RegisterUser, "POST"))
	mux.HandleFunc("/login", methodHandler(handlers.LoginUser, "POST"))

	// Budget routes
	mux.HandleFunc("/api/budgets/create", methodHandler(handlers.CreateBudget, "POST"))
	mux.HandleFunc("/api/budgets/user", methodHandler(handlers.GetBudgetsByUser, "GET"))
	mux.HandleFunc("/api/budgets/update", methodHandler(handlers.UpdateBudget, "PUT"))
	mux.HandleFunc("/api/budgets/delete", methodHandler(handlers.DeleteBudget, "PUT", "DELETE"))

	// Expense routes
	mux.HandleFunc("/expenses", methodHandler(handlers.CreateExpense, "POST"))
	mux.HandleFunc("/expenses/", methodHandler(handlers.DeleteExpense, "PUT", "DELETE")) // Note the trailing slash
	mux.HandleFunc("/expenses/user", methodHandler(handlers.GetExpensesByUser, "GET"))
	mux.HandleFunc("/categories", methodHandler(handlers.GetExpenseCategories, "GET"))
	mux.HandleFunc("/budgets/expense", methodHandler(handlers.SetExpenseLimit, "POST"))


	// income
    mux.HandleFunc("/income/user", methodHandler(handlers.GetIncomeByUser, "GET"))
	mux.HandleFunc("/income/create", methodHandler(handlers.CreateIncome, "POST"))
    mux.HandleFunc("/income/update", methodHandler(handlers.UpdateIncome, "PUT"))
    mux.HandleFunc("/income/delete", methodHandler(handlers.DeleteIncome, "DELETE"))


	// recurring transactions
	mux.HandleFunc("/api/recurrTransac/create", methodHandler(handlers.CreateRecurringTransaction, "POST"))
    mux.HandleFunc("/api/recurrTransac/update", methodHandler(handlers.UpdateRecurringTransaction, "PUT"))
    mux.HandleFunc("/api/recurrTransac/delete", methodHandler(handlers.DeleteRecurringTransaction, "DELETE"))
    mux.HandleFunc("/api/recurrTransac/user", methodHandler(handlers.GetRecurringTransactionsByUser, "GET"))



	log.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
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
