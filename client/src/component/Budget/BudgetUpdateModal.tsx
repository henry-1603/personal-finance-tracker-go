import { useState } from "react";
import axios from "../axiosConfig"; // Ensure axios is configured for API requests
import { jwtDecode } from "jwt-decode"; // Import jwtDecode to decode the token

interface Budget {
  ID: number; // Assuming id is a number; adjust if it's a string
  Category: string;
  Limit: number;
}

interface BudgetUpdateModalProps {
  budget: Budget; // The budget to be updated
  onClose: () => void; // Function to close the modal
  onUpdate: (updatedBudget: Budget) => void; // Function to update the budget in the parent component
}

const BudgetUpdateModal: React.FC<BudgetUpdateModalProps> = ({ budget, onClose, onUpdate }) => {
  const [category, setCategory] = useState(budget.Category);
  const [limit, setLimit] = useState(budget.Limit);

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    let userId: string | null = null;

    // Decode token to get user ID
    if (token) {
      const decoded: { id: string } = jwtDecode(token);
      userId = decoded.id;
    }

    const updatedBudgetData = {
      userId: userId,
      ID: budget.ID, // Assuming budget.id corresponds to the ID in your update API
      category,
      limit,
    };

    try {

      console.log("bud" , budget)
      // Make API call to update the budget
      const response = await axios.put("http://localhost:8080/api/budgets/update", updatedBudgetData);
      onUpdate(response.data); // Call the update function from parent with the new budget data
      onClose(); // Close the modal after updating
    } catch (error) {
      console.error("Failed to update budget:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Update Budget</h2>
        <form onSubmit={handleUpdateBudget}>
          <div className="mb-4">
            <label className="block text-gray-700">Category:</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Limit:</label>
            <input
              type="tel"
              className="mt-1 p-2 w-full border rounded-md"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetUpdateModal;
