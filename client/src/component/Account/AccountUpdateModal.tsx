import React from 'react';
import axios from "../axiosConfig"; // Ensure axios is configured for API requests

interface Account {
  id: string;
  user_id: string;
  account_type: string;
  balance: number;
}

interface Props {
  account: Account;
  onClose: () => void;
  onUpdate: (updatedAccount: Account) => void;
}

const AccountUpdateModal: React.FC<Props> = ({ account, onClose, onUpdate }) => {
  const [formData, setFormData] = React.useState<Account>(account);
  const [loading, setLoading] = React.useState(false); // State to manage loading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    try {
      // API call to update the account
      const response = await axios.put(`/api/accounts/update?id=${account.id}`, formData);
      
      // Assuming the response returns the updated account
      onUpdate(response.data); // Call the update function with updated account data
      onClose(); // Close the modal after updating
    } catch (error) {
      console.error("Failed to update account:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Update Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Account Type</label>
            <input
              type="text"
              value={formData.account_type}
              onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
              className="mt-1 block w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Balance</label>
            <input
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
              className="mt-1 block w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded">
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountUpdateModal;
