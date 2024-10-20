import React, { useState } from "react";
import axios from "axios";

interface RecurringTransaction {
  ID: string; // Using lowercase here
  Type: string;
  Amount: number;
  Interval: string;
  NextOccurrence: string;
}

interface ModalProps {
  transaction: RecurringTransaction;
  closeModal: () => void;
  onUpdate: (updatedTransaction: RecurringTransaction) => void; // Function to refresh the list
}

const UpdateRecurringTransactionModal: React.FC<ModalProps> = ({ transaction, closeModal, onUpdate }) => {
  const [updatedTransaction, setUpdatedTransaction] = useState(transaction);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map the updatedTransaction fields to lowercase before sending the update request
      const payload = {
        type: updatedTransaction.Type,
        amount: updatedTransaction.Amount,
        interval: updatedTransaction.Interval,
        nextOccurrence: updatedTransaction.NextOccurrence,
      };

      // Use the UPDATE API with the correct lowercase field names
      const response  = await axios.put(`/api/recurrTransac/update`, payload, {
        params: { id: updatedTransaction.ID },
      });

      onUpdate(response.data); // Refresh the list after update
      closeModal();
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Update Recurring Transaction</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-gray-700">Type:</label>
            <input
              type="text"
              value={updatedTransaction.Type}
              onChange={(e) =>
                setUpdatedTransaction({ ...updatedTransaction, Type: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount:</label>
            <input
              type="number"
              value={updatedTransaction.Amount}
              onChange={(e) =>
                setUpdatedTransaction({ ...updatedTransaction, Amount: +e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Interval:</label>
            <input
              type="text"
              value={updatedTransaction.Interval}
              onChange={(e) =>
                setUpdatedTransaction({ ...updatedTransaction, Interval: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Next Occurrence:</label>
            <input
              type="date"
              value={updatedTransaction.NextOccurrence.toString().split("T")[0]}
              onChange={(e) =>
                setUpdatedTransaction({ ...updatedTransaction, NextOccurrence: e.target.value })
              }
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Transaction
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default UpdateRecurringTransactionModal;
