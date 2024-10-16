import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface RecurringTransaction {
  _id: string;
  type: string;
  amount: number;
  interval: string;
  nextOccurrence: string;
}

const RecurringTransactionUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<RecurringTransaction>({
    _id: "",
    type: "",
    amount: 0,
    interval: "",
    nextOccurrence: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransaction();
  }, []);

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(`/api/recurrTransac/${id}`);
      setTransaction(response.data);
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/recurrTransac/update?id=${id}`, transaction);
      navigate("/recurring-transactions");
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update Recurring Transaction</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700">Type:</label>
          <input
            type="text"
            value={transaction.type}
            onChange={(e) => setTransaction({ ...transaction, type: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Amount:</label>
          <input
            type="number"
            value={transaction.amount}
            onChange={(e) => setTransaction({ ...transaction, amount: +e.target.value })}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Interval:</label>
          <input
            type="text"
            value={transaction.interval}
            onChange={(e) => setTransaction({ ...transaction, interval: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Next Occurrence:</label>
          <input
            type="date"
            value={transaction.nextOccurrence}
            onChange={(e) => setTransaction({ ...transaction, nextOccurrence: e.target.value })}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Transaction
        </button>
      </form>
    </div>
  );
};

export default RecurringTransactionUpdate;
