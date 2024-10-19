import { useState } from "react";
import axios from "../axiosConfig"; // Ensure axios is configured for API requests
import { jwtDecode } from "jwt-decode"; // Import jwtDecode to decode the token
import { useNavigate } from "react-router-dom";


const BudgetCreate = () => {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(0);
  const [error, setError] = useState<string | null>(null); // State to manage error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages
  const navigate = useNavigate()
  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the token from local storage
    let userId: string | null = null;

    // Decode the token to get the user ID
    if (token) {
      const decoded: { id: string } = jwtDecode(token);
      userId = decoded.id;
    }

    if (!userId) {
      setError("User ID is required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/budgets/create", {
        userId,
        category,
        limit,
      });

      // Handle success response
      if (response.status === 201) {
        setSuccessMessage("Budget created successfully!");
        setCategory(""); // Clear category
        setLimit(0); // Reset limit

        setTimeout(() => {
          navigate("/budgets");
        }, 2000);
      }
    } catch (error) {
      // Handle error response
      console.error("Failed to create budget:", error);
      setError("Failed to create budget. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Budget</h2>
      <form onSubmit={handleCreateBudget}>
        <div className="mb-4">
          <label className="block text-gray-700">Category:</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required // Make field required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Limit:</label>
          <input
            type="tel"
            className="mt-1 p-2 w-full border rounded-md"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            required // Make field required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
      
      {/* Display error message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {/* Display success message */}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
};

export default BudgetCreate;
