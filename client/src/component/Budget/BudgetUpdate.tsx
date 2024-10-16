import { useState } from "react";

const BudgetUpdate = ({ budgetId }: { budgetId: string }) => {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(0);

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to update budget here using budgetId
    console.log("Update Budget:", { budgetId, category, limit });
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Budget</h2>
      <form onSubmit={handleUpdateBudget}>
        <div className="mb-4">
          <label className="block text-gray-700">Category:</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Limit:</label>
          <input
            type="number"
            className="mt-1 p-2 w-full border rounded-md"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default BudgetUpdate;
