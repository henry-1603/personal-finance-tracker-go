import React from "react";
import { Link } from "react-router-dom";

const Budgets: React.FC = () => {
  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Manage Budgets</h2>
      <Link to="/budgets/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Budget
      </Link>
      {/* Additional code to display budgets goes here */}
    </div>
  );
};

export default Budgets;
