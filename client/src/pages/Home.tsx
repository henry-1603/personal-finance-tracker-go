import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Personal Finance Tracker</h1>
      <p className="mb-4">Manage your expenses, income, budgets, and more!</p>
      <div className="space-y-2">
        <Link to="/recurring-transactions" className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View Recurring Transactions
        </Link>
        <Link to="/expenses" className="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Manage Expenses
        </Link>
        <Link to="/income" className="block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Manage Income
        </Link>
        <Link to="/budgets" className="block bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          Manage Budgets
        </Link>
        <Link to="/accounts" className="block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Manage Accounts
        </Link>
      </div>
    </div>
  );
};

export default Home;
