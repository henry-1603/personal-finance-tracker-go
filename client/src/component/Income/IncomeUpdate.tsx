import { useState } from "react";

const IncomeUpdate = ({ incomeId }: { incomeId: string }) => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");

  const handleUpdateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to update income here using incomeId
    console.log("Update Income:", { incomeId, source, amount, description });
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Income</h2>
      <form onSubmit={handleUpdateIncome}>
        <div className="mb-4">
          <label className="block text-gray-700">Source:</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={source}
            onChange={(e) => setSource(e.target.value)}
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

export default IncomeUpdate;
