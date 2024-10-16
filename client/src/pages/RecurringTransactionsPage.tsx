import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { getRecurringTransactions, createRecurringTransaction, deleteRecurringTransaction } from '../api'; // Assume these functions are defined in your API layer

interface RecurringTransaction {
    id: string;
    type: string;
    amount: number;
    interval: string;
    nextOccurrence: string;
  }

const RecurringTransactionsPage = () => {
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRecurringTransactions = async () => {
//       try {
//         const data = await getRecurringTransactions(); // Fetch recurring transactions
//         setRecurringTransactions(data);
//       } catch (error) {
//         console.error('Error fetching recurring transactions:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecurringTransactions();
//   }, []);

  const handleDelete = async (id: string) => {
    try {
    //   await deleteRecurringTransaction(id);
      setRecurringTransactions(recurringTransactions.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.error('Error deleting recurring transaction:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recurring Transactions</h1>
      <Link to="/recurring-transactions/create" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">Add Recurring Transaction</Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b p-2">Type</th>
              <th className="border-b p-2">Amount</th>
              <th className="border-b p-2">Interval</th>
              <th className="border-b p-2">Next Occurrence</th>
              <th className="border-b p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recurringTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="border-b p-2">{transaction.type}</td>
                <td className="border-b p-2">${transaction.amount.toFixed(2)}</td>
                <td className="border-b p-2">{transaction.interval}</td>
                <td className="border-b p-2">{transaction.nextOccurrence}</td>
                <td className="border-b p-2">
                  <Link to={`/recurring-transactions/edit/${transaction.id}`} className="text-blue-500 mr-2">Edit</Link>
                  <button onClick={() => handleDelete(transaction.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecurringTransactionsPage;
