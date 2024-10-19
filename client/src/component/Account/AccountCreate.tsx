import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";  // Ensure axios is configured for API requests
import { jwtDecode } from "jwt-decode"; // Correct import

interface TokenPayload {
  id: string; // Define the structure of your token payload
}

const AccountCreate = () => {
  const [accountType, setAccountType] = useState("");
  const [balance, setBalance] = useState(0);
  const [currency] = useState("INR");  // Fixed currency for now
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [accountTypes, setAccountTypes] = useState<string[]>([]); // State to hold account types

  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Get the token from local storage
  let userId: string | null = null; // Declare userId

  // Decode the token and extract the userId
  if (token) {
    const decoded: TokenPayload = jwtDecode(token);
    userId = decoded.id; // Extract the user ID
  }

  useEffect(() => {
    // Fetch account types from API or define them statically
    const fetchAccountTypes = async () => {
      try {
        // If you have an API to get account types, use it here.
        // const response = await axios.get("/account-types");
        // setAccountTypes(response.data);

        // For demonstration, using static account types
        const types = ["Savings", "Checking", "Credit", "Investment"];
        setAccountTypes(types);
      } catch (error) {
        console.error("Failed to fetch account types:", error);
        setError("Failed to load account types.");
      }
    };

    fetchAccountTypes();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Ensure userId is present
    if (!userId) {
      setError("User not found. Please log in.");
      return;
    }

    const payload = {
      user_id: userId,
      account_type: accountType,
      balance,
      currency
    };

    try {
      const response = await axios.post("/api/accounts/create", payload);
      console.log(response);
      setSuccess("Account created successfully!");
      setError("");
      
      // Redirect to accounts list after 2 seconds
      setTimeout(() => {
        navigate("/accounts");
      }, 2000);
    } catch (err) {
      setError("Failed to create account. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      
      <form onSubmit={handleCreateAccount}>
        <div className="mb-4">
          <label className="block text-gray-700">Account Type:</label>
          <select
            className="mt-1 p-2 w-full border rounded-md"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          >
            <option value="" disabled>Select an account type</option>
            {accountTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Initial Balance:</label>
          <input
            type="tel"
            className="mt-1 p-2 w-full border rounded-md"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            required
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
