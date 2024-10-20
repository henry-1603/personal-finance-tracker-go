import { useState, useEffect } from "react";
import axios from "../axiosConfig"; // Ensure axios is configured for API requests
import { jwtDecode } from "jwt-decode"; // Correct import
import AccountUpdateModal from './AccountUpdateModal'; // Import the modal
import "../../assets/css/updateModal.css"

interface Account {
  id: string;
  user_id: string;
  account_type: string;
  balance: number;
}

const AccountList = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      const token = localStorage.getItem("token");
      let userId: string | null = null;

      if (token) {
        const decoded: { id: string } = jwtDecode(token);
        userId = decoded.id;
      }

      try {
        const response = await axios.get(`/api/accounts/user?user_id=${userId}`);
        if (Array.isArray(response.data)) {
          setAccounts(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setAccounts([]);
        }
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
        setAccounts([]);
      }
    };
    fetchAccounts();
  }, []);

  const handleDeleteAccount = async (accountId: string) => {
    // Confirm deletion with the user
    const confirmDelete = window.confirm("Are you sure you want to delete this account?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/accounts/delete?id=${accountId}`);
        setAccounts(accounts.filter(account => account.id !== accountId));
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
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
    <div className="p-6 max-w-full mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Accounts</h2>
      {accounts.length === 0 ? (
        <p className="text-red-500">No accounts found.</p>
      ) : (
        <ul>
          {accounts.map((account) => (
            <li key={account.id} className="mb-2 flex justify-between items-center">
              

              <span className="flex flex-row space-x-[1rem]">
              <span className="text-xl font-bold">{account.account_type}  :</span> 
              <span className="text-xl font-bold"> ₹{account.balance} 
             

              </span>
              </span>
              <div className="space-x-4">
              <button
                onClick={() => openModal(account)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-3 rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteAccount(account.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded"
              >
                Delete
              </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
