import React from 'react';
import ExpenseList from '../component/Expense/ExpenseList'; // Adjust the import based on your file structure
import { Link } from 'react-router-dom';

const ExpensesPage: React.FC = () => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Your Expenses</h1>

      {/* Expense List Component */}
      <ExpenseList />

      {/* Buttons for Back to Dashboard and Add Expense */}
      <div className="mt-6 flex justify-between">
        <Link
          to="/dashboard"
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </Link>
        <Link
          to="/expenses/create"
          className="bg-blue-500 hover:bg-blue-700 text-gray font-bold py-2 px-4 rounded"
        >
          Add Expense
        </Link>
      </div>
    </div>
  );
};

export default ExpensesPage;
