import { useState, useEffect } from "react";
import axios from "../axiosConfig"; // Ensure axios is configured for API requests
import { jwtDecode } from "jwt-decode"; // Correct import
import AccountUpdateModal from './AccountUpdateModal'; // Import the modal

interface Account {
  id: string;
  user_id: string;
  account_type: string;
  balance: number;
}

const AccountList = () => {
  const [accounts, setAccounts] = useState<Account[]>([]); // Ensure this is an empty array
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null); // State to hold selected account for update
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token"); // Get token from local storage
      let userId: string | null = null;

      // Decode token to get user ID
      if (token) {
        const decoded: { id: string } = jwtDecode(token);
        userId = decoded.id;
      }

      try {
        console.log("User ID: " + userId);
        const response = await axios.get(`/api/accounts/user?user_id=${userId}`);
        
        // Ensure response.data is an array
        if (Array.isArray(response.data)) {
          setAccounts(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setAccounts([]); // Set to empty array if response is not as expected
        }
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
        setAccounts([]); // Optionally reset accounts to an empty array on error
      }
    };
    fetchAccounts();
  }, []);

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await axios.delete(`/api/accounts/delete?id=${accountId}`);
      setAccounts(accounts.filter(account => account.id !== accountId)); // Remove deleted account from state
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const openModal = (account: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleUpdate = (updatedAccount: Account) => {
    setAccounts(prev => 
      prev.map(account => (account.id === updatedAccount.id ? updatedAccount : account))
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Accounts</h2>
      {accounts.length === 0 ? (
        <p className="text-red-500">No accounts found.</p> // Display message if no accounts
      ) : (
        <ul>
          {accounts.map((account) => (
            <li key={account.id} className="mb-2 flex justify-between items-center">
              <span className="font-bold">{account.account_type}</span>: ₹{account.balance}
              <button
                onClick={() => openModal(account)} // Open modal with account data
                className="bg-yellow-500 hover:bg-yellow-600 text-gray font-bold py-1 px-2 rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteAccount(account.id)}
                className="bg-red-500 hover:bg-red-600 text-gray font-bold py-1 px-2 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Render the modal outside the main flow */}
      {isModalOpen && selectedAccount && (
        <AccountUpdateModal
          account={selectedAccount}
          onClose={closeModal}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AccountList;
