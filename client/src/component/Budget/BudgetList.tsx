import { useEffect, useState } from "react";
import axios from "../axiosConfig"; // Ensure axios is configured for API requests
import { jwtDecode } from "jwt-decode"; // Import jwtDecode to decode the token
// import BudgetCreate from "./BudgetCreate"; // Import your BudgetCreate component
import BudgetUpdateModal from "./BudgetUpdateModal"; // Import your BudgetUpdateModal component
import "../../assets/css/updateModal.css"

interface Budget {
  ID: number;
  Category: string;
  Limit: number;
}

const BudgetList = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null); // State for the selected budget for updating
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State to manage update modal visibility

  useEffect(() => {
    // Fetch budgets for the user
    const fetchBudgets = async () => {
      const token = localStorage.getItem("token");
      let userId: string | null = null;

      // Decode token to get user ID
      if (token) {
        const decoded: { id: string } = jwtDecode(token);
        userId = decoded.id;
      }

      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/budgets/user?userId=${userId}`);
          // Ensure the response data is an array
          if (Array.isArray(response.data)) {
            setBudgets(response.data); // Set budgets from API response
          } else {
            console.error("Unexpected response format:", response.data);
            setBudgets([]); // Reset budgets state if response is not an array
          }
        } catch (error) {
          console.error("Failed to fetch budgets:", error);
          setBudgets([]); // Reset budgets state on error
        }
      }
    };

    fetchBudgets();
  }, []);

  const handleDeleteBudget = async (budgetId: number) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axios.delete(`http://localhost:8080/api/budgets/delete?id=${budgetId}`);
        setBudgets(budgets.filter(budget => budget.ID !== budgetId)); // Remove deleted budget from state
      } catch (error) {
        console.error("Failed to delete budget:", error);
      }
    }
  };

  const openUpdateModal = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedBudget(null);
  };

  const handleUpdate = (updatedBudget: Budget) => {
    setBudgets(prev => 
      prev.map(budget => (budget.ID === updatedBudget.ID ? updatedBudget : budget))
    );
  };

  return (
    <div className="p-6 max-w-full mx-auto bg-gray rounded-lg shadow-md">
      {/* <h2 className="text-xl font-bold mb-4">Your Budgets</h2> */}

      {/* Display message if no budgets found */}
      {budgets.length === 0 ? (
        <p className="text-red-500">No budgets found.</p> // Message if no budgets
      ) : (
        <ul>
          {budgets.map((budget) => (
            <li key={budget.ID} className="mb-2 flex justify-between items-center">
          
          
              <span className="flex flex-row space-x-[1rem]">
              <span className="text-xl font-bold">{budget.Category}  :</span> 
              <span className="text-xl font-bold"> ₹{budget.Limit} 
             

              </span>
              </span>
            <div>
                <button
                  onClick={() => openUpdateModal(budget)} // Open update modal
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteBudget(budget.ID)} // Delete budget
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded"
                >
                  Delete
                </button>
                </div>
            </li>
          ))}
        </ul>
      )}

      {/* Render the update modal */}
      {isUpdateModalOpen && selectedBudget && (
        <BudgetUpdateModal
          budget={selectedBudget}
          onClose={closeUpdateModal}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default BudgetList;
