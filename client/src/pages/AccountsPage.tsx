// import React from 'react';
import AccountList from '../component/Account/AccountList'; // Assuming Accounts component is in the components folder
import { Link } from 'react-router-dom'; // Import Link to handle navigation

const AccountsPage = () => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Your Accounts</h1>

      {/* Include Accounts component which lists accounts */}
      <AccountList />

      {/* Add Account Button */}
      <div className="mt-6 flex justify-between">
        <Link
          to="/dashboard"
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </Link>
        <Link
          to="/accounts/create"
          className="bg-blue-500 hover:bg-blue-700 text-gray font-bold py-2 px-4 rounded"
        >
          Add Account
        </Link>
      </div>
    </div>
  );
};

export default AccountsPage;
