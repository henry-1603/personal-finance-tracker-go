import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { jwtDecode } from "jwt-decode";

const ExpenseCreate: React.FC = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    let userId: string | null = null;

    // Decode the token to get the user ID
    if (token) {
      const decoded: { id: string } = jwtDecode(token); // Assuming jwtDecode is already imported
      userId = decoded.id;
    }

    if (!userId) {
      alert("User ID is required.");
      return;
    }

    const expenseData = {
      user_id: userId,
      category,
      amount,
      description,
    };

    try {
      const response = await fetch("http://localhost:8080/expense/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        // Redirect or show success message
        alert("Expense created successfully!");
        navigate("/expenses"); // Redirect to the expenses list
      } else {
        const errorData = await response.json();
        console.error("Error creating expense:", errorData);
        alert("Failed to create expense. Please try again.");
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Expense</h2>
      <form onSubmit={handleCreateExpense}>
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
          <label className="block text-gray-700">Amount:</label>
          <input
            type="tel"
            className="mt-1 p-2 w-full border rounded-md"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ExpenseCreate;
