import { useState } from "react";

const ExpenseUpdate = ({ expenseId }: { expenseId: string }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to update expense here using expenseId
    console.log("Update Expense:", { expenseId, category, amount, description });
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Expense</h2>
      <form onSubmit={handleUpdateExpense}>
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
          <label className="block text-gray-700">Amount:</label>
          <input
            type="number"
            className="mt-1 p-2 w-full border rounded-md"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

export default ExpenseUpdate;
