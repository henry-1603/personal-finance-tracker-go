import { useEffect, useState } from "react";
import ExpenseUpdateModal from "./ExpenseUpdateModal"; // Import the update modal
import { jwtDecode } from "jwt-decode"; // Import jwtDecode to decode the token
import "../../assets/css/updateModal.css"

// Define the Expense type
interface Expense {
  ID: string;
  UserID: string;
  Category: string;
  Amount: number;
  Date: string;
  Description: string;
}

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]); // Initialize as an empty array
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const token = localStorage.getItem("token"); // Get the token from local storage
  let userId: string | null = null;

  // Decode the token to get the user ID
  if (token) {
    const decoded: { id: string } = jwtDecode(token);
    userId = decoded.id;
  }

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/expenses/user?user_id=${userId}`);
        const data = await response.json();
        
        // Ensure data is an array before setting state
        setExpenses(Array.isArray(data) ? data : []); 
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setExpenses([]); // Set to an empty array on error
      }
    };
    fetchExpenses();
  }, [userId]);

  const handleDeleteExpense = async (expenseId: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await fetch(`http://localhost:8080/expense/delete?expense_id=${expenseId}`, { method: "DELETE" });
        setExpenses(expenses.filter(expense => expense.ID !== expenseId));
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const openUpdateModal = (expense: Expense) => {
    console.log("Open update modal")
    setSelectedExpense(expense);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedExpense(null);
  };

  const handleUpdate = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(expense => (expense.ID === updatedExpense.ID ? updatedExpense : expense)));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      {/* <h2 className="text-xl font-bold mb-4">Your Expenses</h2> */}
      {expenses.length === 0 ? ( // Check if expenses are empty
        <p className="text-gray-500">No expenses found.</p> // Message for no expenses
      ) : (
        <ul>
          {expenses.map(expense => (
            <li key={expense.ID} className="flex justify-between mb-2">
              <span>{expense.Category}</span>: ${expense.Amount} ({expense.Description})
              <div>
                <button 
                  onClick={() => openUpdateModal(expense)} 
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Update
                </button>
                <button 
                  onClick={() => handleDeleteExpense(expense.ID)} 
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isUpdateModalOpen && selectedExpense && (
        <ExpenseUpdateModal
          expense={selectedExpense}
          onClose={closeUpdateModal}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ExpenseList;
