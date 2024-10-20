import { useState } from "react";

// Define the Expense type
interface Expense {
  ID: string;
  UserID: string;
  Category: string;
  Amount: number;
  Date: string;
  Description: string;
}

const ExpenseUpdateModal = ({ expense, onClose, onUpdate }: { expense: Expense; onClose: () => void; onUpdate: (expense: Expense) => void }) => {
  const [category, setCategory] = useState(expense.Category);
  const [amount, setAmount] = useState(expense.Amount);
  const [description, setDescription] = useState(expense.Description);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/expense/update?expense_id=${expense.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, amount, description  })
      });

      if (response.ok) {
        const updatedExpense = { ...expense, Category: category, Amount: amount, Description: description };
        onUpdate(updatedExpense); // Update the expense in the list
        onClose(); // Close the modal
      } else {
        console.error("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">Update Expense</h2>
        <form onSubmit={handleUpdate}>
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
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </form>
        <button onClick={onClose} className="mt-2 text-red-500">Cancel</button>
      </div>
    </div>
  );
};

export default ExpenseUpdateModal;
