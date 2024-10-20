import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../component/axiosConfig"; // Ensure axios is configured for API requests
import { jwtDecode } from "jwt-decode"; // Import jwtDecode to decode the token

interface Budget {
  id: number;
  Category: string;
  Limit: number;
}

interface Transaction {
  ID: string;
  Type: string;
  Amount: number;
  Interval: string;
  NextOccurrence: string;
}

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recentTransactions,setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    // Redirect to login page
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      let userId: string | null = null;

      // Decode token to get user ID
      if (token) {
        const decoded: { id: string } = jwtDecode(token);
        userId = decoded.id;
      }

      if (userId) {
        try {
          // Fetch income data
          const incomeResponse = await axios.get(
            `http://localhost:8080/income/user?user_id=${userId}`
          );

          console.log(incomeResponse)
          const totalIncome = incomeResponse.data.reduce(
            (
              acc: number,
              item: {
                Amount: number;
              }
            ) => acc + item.Amount,
            0
          );
          setTotalIncome(totalIncome);

          // Fetch expenses data
          const expensesResponse = await axios.get(`http://localhost:8080/expenses/user?user_id=${userId}`);
          const totalExpense = expensesResponse.data.reduce(
            (
              acc: number,
              item: {
                Amount: number;
              }
            ) => acc + item.Amount,
            0
          );
          setTotalExpenses(totalExpense);

          // Fetch budgets data
          const budgetsResponse = await axios.get(
            `http://localhost:8080/api/budgets/user?userId=${userId}`
          );
          setBudgets(budgetsResponse.data);
          console.log("daa", budgetsResponse.data);

          // Fetch recent transactions
          const recentResponse = await axios.get(`http://localhost:8080/api/recurrTransac/user?user_id=${userId}`);
          console.log("recent", recentResponse.data);
          setRecentTransactions(recentResponse.data.slice(0, 5)); // Limit to 5 recent transactions
          console.log(recentTransactions)
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  const getBudgetUsageColor = (usage: number) => {
    console.log("Getting budget usage color from : " + usage);
    if (usage > 100) return "text-red-600"; // Red
    if (usage > 75) return "text-orange-600"; // Orange
    if (usage > 50) return "text-yellow-600"; // Yellow
    return "text-green-600"; // Green
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        Logout
      </button>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Income */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Income</h2>
          <p className="text-2xl font-bold">₹{totalIncome.toFixed(2)}</p>
        </div>

        {/* Expenses */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Expenses</h2>
          <p className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
        </div>

        {/* Budgets */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Budgets</h2>
          <ul>
            {budgets.map((budget) => {
              const budgetUsage =
                totalExpenses > 0 ? (totalExpenses / budget.Limit) * 100 : 0;
              return (
                <li key={budget.id} className="flex justify-between">
                  <span>{budget.Category} :</span>
                  <span className={getBudgetUsageColor(budgetUsage)}>
                    ₹{budget.Limit.toFixed(2)} ({budgetUsage.toFixed(2)}% used)
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Recurring Transactions */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <ul>
            {recentTransactions.map((transaction) => (
              <li key={transaction.ID} className="flex justify-between">
                <span>{transaction.Type}</span>
                <span>
                  ₹{transaction.Amount.toFixed(2)}   {new Date(transaction.NextOccurrence).toISOString().split("T")[0]}

                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Links */}
      <div className="mt-6">
        <Link to="/budgets" className="text-gray-500 underline">
          Manage Budgets
        </Link>
        <Link to="/expenses" className="text-blue-500 underline ml-4">
          View Expenses
        </Link>
        <Link to="/incomes" className="text-blue-500 underline ml-4">
          View Incomes
        </Link>
        <Link to="/accounts" className="text-blue-500 underline ml-4">
          Manage Accounts
        </Link>
        <Link to="/recurring-transactions" className="text-blue-500 underline ml-4">
          Manage Recurring Transactions
        </Link> {/* Added Recurring Transactions Link */}
      </div>

     
    </div>
  );
};

export default Dashboard;
