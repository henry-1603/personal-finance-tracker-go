import React from "react";
import { Link } from "react-router-dom";

const Income: React.FC = () => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Income</h2>
      <Link to="/income/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Income
      </Link>
      {/* Additional code to display income records goes here */}
    </div>
  );
};

export default Income;
