import { useState } from "react";

interface Income {
  ID: string;
  Source: string;
  Amount: number;
  Description: string;
}

const IncomeUpdateModal = ({ income, onClose, onUpdate }: { income: Income, onClose: () => void, onUpdate: (income: Income) => void }) => {
  const [source, setSource] = useState(income.Source);
  const [amount, setAmount] = useState(income.Amount);
  const [description, setDescription] = useState(income.Description);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8080/income/update?id=${income.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, amount, description }) // Send lowercase fields
      });

      // Update the parent component with the new values
      onUpdate({ ...income, Source: source, Amount: amount, Description: description }); // Capitalize for state
      onClose();
    } catch (error) {
      console.error("Error updating income:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Update Income</h2>
        <form onSubmit={handleUpdate}>
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
              type="tel"
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
         <div className="flex justify-between">
        <button onClick={onClose}  className="mt-2 font-bold text-red-500">Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </div>
        </form>
        
      </div>
    </div>
  );
};

export default IncomeUpdateModal;
