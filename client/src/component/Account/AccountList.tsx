import { useEffect, useState } from "react";

interface accounts {
    id: number;
    type: string;
    balance: number;
}

const AccountList = () => {
  const [accounts, setAccounts] = useState<accounts[]>([]);

  useEffect(() => {
    // Fetch accounts for the user
    const fetchAccounts = async () => {
      // Add API call here
      const accounts = [
        { id: 1, type: "Checking", balance: 1000 },
        { id: 2, type: "Savings", balance: 5000 },
      ];
      setAccounts(accounts);
    };
    fetchAccounts();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Accounts</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.id} className="mb-2">
            <span className="font-bold">{account.type}</span>: ${account.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;
