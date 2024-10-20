import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      let userId: string | null = null;

      if (token) {
        const decoded: { id: string } = jwtDecode(token);
        userId = decoded.id;
      }

      if (userId) {
        try {
          const incomeResponse = await axios.get(`http://localhost:8080/income/user?user_id=${userId}`);
          const totalIncome = incomeResponse.data.reduce((acc: number, item: { Amount: number }) => acc + item.Amount, 0);
          setTotalIncome(totalIncome);

          const expensesResponse = await axios.get(`http://localhost:8080/expenses/user?user_id=${userId}`);
          const totalExpense = expensesResponse.data.reduce((acc: number, item: { Amount: number }) => acc + item.Amount, 0);
          setTotalExpenses(totalExpense);

          const budgetsResponse = await axios.get(`http://localhost:8080/api/budgets/user?userId=${userId}`);
          setBudgets(budgetsResponse.data);

          const recentResponse = await axios.get(`http://localhost:8080/api/recurrTransac/user?user_id=${userId}`);
          setRecentTransactions(recentResponse.data.slice(0, 5));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  const getBudgetUsageColor = (usage: number) => {
    if (usage > 100) return "text-red-600"; // Red
    if (usage > 75) return "text-orange-600"; // Orange
    if (usage > 50) return "text-yellow-600"; // Yellow
    return "text-green-600"; // Green
  };

  return (
    <div className="min-h-screen bg-[#040F30] p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[4rem] text-white font-bold">Dashboard</h1>
        <div className="space-x-3">
          <button
            onClick={() => handleNavigation("/accounts")}
            className="bg-blue-500 font-bold hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
          >
            Manage Accounts
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 font-bold hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 my-[5rem]  gap-6">
        {/* Income */}
        <div className="bg-white items-center p-6 rounded-lg shadow-lg transition-transform transform hover:bg-gray-200">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Total Income</h2>
            <p className="text-2xl font-bold">₹{totalIncome.toFixed(2)}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleNavigation("/incomes")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
            >
              Manage Incomes
            </button>
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white items-center p-6 rounded-lg shadow-lg transition-transform transform hover:bg-gray-200">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold ">Total Expenses</h2>
            <p className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleNavigation("/expenses")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
            >
              Manage Expenses
            </button>
          </div>
        </div>

        {/* Budgets */}
        {/* Budgets */}
<div className="bg-white flex flex-col h-full p-6 rounded-lg shadow-lg transition-transform transform hover:bg-gray-300">
  <div className="flex flex-row justify-between items-center mb-4">
    <h2 className="text-3xl font-semibold text-black underline">Budgets</h2>
  </div>
  <table className="w-full">
    <thead>
      <tr className="text-left">
        <th className="text-lg w-[70%] font-bold">Category</th>
        <th className="text-lg text-left font-bold">Limit</th>
      </tr>
    </thead>
    <tbody>
      {budgets.map((budget) => {
        const budgetUsage = totalExpenses > 0 ? (totalExpenses / budget.Limit) * 100 : 0;
        return (
          <tr key={budget.id} className="border-b">
            <td className="py-2">{budget.Category}</td>
            <td className={`${getBudgetUsageColor(budgetUsage)} py-2 font-bold text-left`}>
              ₹{budget.Limit.toFixed(2)} ({budgetUsage.toFixed(2)}% used)
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
  <div className="flex justify-end mt-auto">
    <button
      onClick={() => handleNavigation("/budgets")}
      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 my-4 rounded transition duration-300"
    >
      Manage Budgets
    </button>
  </div>
</div>

{/* Recurring Transactions */}
<div className="bg-white flex-col flex h-full p-6 rounded-lg shadow-lg transition-transform transform hover:bg-gray-300">
  <div className="flex flex-row justify-between items-center mb-4">
    <h2 className="text-3xl font-semibold text-black underline">Recent Transactions</h2>
  </div>
  <table className="w-full">
    <thead>
      <tr className="text-left">
        <th className="text-lg font-bold">Category</th>
        <th className="text-lg text-right font-bold">Amount</th>
        <th className="text-lg text-center font-bold">Next Date</th>
      </tr>
    </thead>
    <tbody>
      {recentTransactions.map((transaction) => (
        <tr key={transaction.ID} className="border-b">
          <td className="py-2 font-bold">{transaction.Type}</td>
          <td className="py-2 font-bold text-right">₹{transaction.Amount.toFixed(2)}</td>
          <td className="py-2 font-bold  text-center">
            {new Date(transaction.NextOccurrence).toISOString().split("T")[0]}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <div className="flex justify-end mt-auto">
    <button
      onClick={() => handleNavigation("/recurring-transactions")}
      className="bg-blue-500 hover:bg-blue-600 my-4 text-white py-2 px-4 rounded transition duration-300"
    >
      Manage Recurring Transactions
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
