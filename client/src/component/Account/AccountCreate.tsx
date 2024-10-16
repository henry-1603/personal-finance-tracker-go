import { useState } from "react";

const AccountCreate = () => {
  const [accountType, setAccountType] = useState("");
  const [balance, setBalance] = useState(0);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to create account here
    console.log("Create Account:", { accountType, balance });
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleCreateAccount}>
        <div className="mb-4">
          <label className="block text-gray-700">Account Type:</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Initial Balance:</label>
          <input
            type="number"
            className="mt-1 p-2 w-full border rounded-md"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AccountCreate;
