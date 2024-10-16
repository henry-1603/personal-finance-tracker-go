import React from "react";
import { Link } from "react-router-dom";

const Accounts: React.FC = () => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Accounts</h2>
      <Link to="/accounts/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Account
      </Link>
      {/* Additional code to display accounts goes here */}
    </div>
  );
};

export default Accounts;
