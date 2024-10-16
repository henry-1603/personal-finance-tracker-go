import React, { useEffect, useState } from "react";
import axios from "axios";

interface RecurringTransaction {
  _id: string;
  type: string;
  amount: number;
  interval: string;
  nextOccurrence: string;
}

const RecurringTransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([]);

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const fetchRecurringTransactions = async () => {
    try {
      const response = await axios.get("/api/recurrTransac/user");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching recurring transactions:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Recurring Transactions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Interval</th>
              <th className="py-2 px-4 border-b">Next Occurrence</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="py-2 px-4 border-b">{transaction.type}</td>
                <td className="py-2 px-4 border-b">{transaction.amount}</td>
                <td className="py-2 px-4 border-b">{transaction.interval}</td>
                <td className="py-2 px-4 border-b">{transaction.nextOccurrence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringTransactionList;
