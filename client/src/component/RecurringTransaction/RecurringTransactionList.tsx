import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateRecurringTransactionModal from "./UpdateRecurringTransactionModal";
import {jwtDecode} from "jwt-decode"; // Correct import

interface TokenPayload {
  id: string;
}
interface RecurringTransaction {
  ID: string;
  Type: string;
  Amount: number;
  Interval: string;
  NextOccurrence: string;
}


const RecurringTransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<RecurringTransaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // console.log(userId)

  useEffect(() => {
    const fetchRecurringTransactions = async () => {
      setLoading(false);
      const token = localStorage.getItem("token");
      let userId: string | null = null;

      if (token) {
        const decoded: { id: string } = jwtDecode(token);
        userId = decoded.id;
      }

      try {
        const response = await axios.get(`/api/recurrTransac/user?user_id=${userId}`);
        console.log(response.data);
      if (response.data.length === 0) {
        setError("No recurring transactions found.");
        setTransactions([])
      } else {
        setTransactions(response.data);
        setError(null);
      }
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
        setTransactions([]);
      }
    };
    fetchRecurringTransactions();
  }, []);

  const handleDelete = async (transactionId: string) => {
    if (window.confirm("Are you sure you want to delete this Recurring Transaction?")) {
    try {
      await axios.delete(`/api/recurrTransac/delete`, { params: { id: transactionId } });
      setTransactions(transactions.filter((transaction) => transaction.ID !== transactionId));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }
  };

  const handleUpdateClick = (transaction: RecurringTransaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedTransaction: RecurringTransaction) => {
    setTransactions(prev => 
      prev.map(transactions => (transactions.ID === updatedTransaction.ID ? updatedTransaction : transactions))
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl w-full font-bold mb-4">Recurring Transactions</h2>
{ transactions.length === 0 ? (
        <p>No recurring transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Type</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Interval</th>
                <th className="py-2 px-4 border-b">Next Occurrence</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.ID}>
                  <td className="py-2 px-4 border-b">{transaction.Type}</td>
                  <td className="py-2 px-4 border-b">₹{transaction.Amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{transaction.Interval}</td>
                  <td className="py-2 px-4 border-b">
  {new Date(transaction.NextOccurrence).toISOString().split("T")[0]}
</td>
                  <td className="py-2 px-4 border-b flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleUpdateClick(transaction)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(transaction.ID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedTransaction && (
        <UpdateRecurringTransactionModal
          transaction={selectedTransaction}
          closeModal={() => setIsModalOpen(false)}
          onUpdate={handleUpdate} // No argument required here
        />
      )}
    </div>
  );
};

export default RecurringTransactionList;
