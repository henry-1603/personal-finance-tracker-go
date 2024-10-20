import RecurringTransactionList from '../component/RecurringTransaction/RecurringTransactionList'; // Adjust the import based on your file structure
import { Link } from 'react-router-dom'; // Import Link to handle navigation

const RecurringTransactionsPage = () => {
  return (
    <div className="p-6 max-w-[50%] mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Your Transactions</h1>

      <RecurringTransactionList />

      {/* Add Budget Button */}
      <div className="mt-6 flex justify-between">
        <Link
          to="/dashboard"
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </Link>
        <Link
          to="/recurring-transactions/create"
          className="bg-blue-500 hover:bg-blue-700 text-gray font-bold py-2 px-4 rounded"
        >
          Add Transaction
        </Link>
      </div>
    </div>
  );
};

export default RecurringTransactionsPage;
