import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import

interface TokenPayload {
  id: string; // Define the structure of your token payload
}

const RecurringTransactionCreate: React.FC = () => {

  const token = localStorage.getItem("token"); // Get the token from local storage
  let userId: string | null = null; // Declare userId

  // Decode the token and extract the userId
  if (token) {
    const decoded: TokenPayload = jwtDecode(token);
    userId = decoded.id; // Extract the user ID
  }


  const [transaction, setTransaction] = useState({
    userId : userId,
    type: "",
    amount: 0,
    interval: "",
    nextOccurrence: "",
  });
  const navigate = useNavigate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/recurrTransac/create", transaction);
      navigate("/recurring-transactions");
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Recurring Transaction</h2>
      <form onSubmit={handleCreate}>
        <div className="mb-4">
          <label className="block text-gray-700">Type:</label>
          <input
            type="text"
            value={transaction.type}
            onChange={(e) => setTransaction({ ...transaction, type: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Amount:</label>
          <input
            type="tel"
            value={transaction.amount}
            onChange={(e) => setTransaction({ ...transaction, amount: +e.target.value })}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div className="mb-4">
  <label className="block text-gray-700">Interval:</label>
  <select
    value={transaction.interval}
    onChange={(e) => setTransaction({ ...transaction, interval: e.target.value })}
    className="mt-1 p-2 border rounded w-full"
    required
  >
    <option value="" disabled>Select Interval</option> {/* Default option */}
    <option value="weekly">Weekly</option>
    <option value="monthly">Monthly</option>
  </select>
</div>

        <div className="mb-4">
          <label className="block text-gray-700">Next Occurrence:</label>
          <input
            type="date"
            value={transaction.nextOccurrence}
            onChange={(e) => setTransaction({ ...transaction, nextOccurrence: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Transaction
        </button>
      </form>
    </div>
  );
};

export default RecurringTransactionCreate;
