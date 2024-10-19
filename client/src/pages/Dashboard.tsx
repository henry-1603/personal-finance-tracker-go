import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../component/axiosConfig'; // Ensure axios is configured for API requests
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode to decode the token

interface Budget {
    id: number;
    Category: string;
    Limit: number;
}

interface Transaction {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    date: string;
}

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      let userId: string | null = null;

      // Decode token to get user ID
      if (token) {
        const decoded: { id: string } = jwtDecode(token);
        userId = decoded.id;
      }

      if (userId) {
        try {
          // Fetch income data
          // const incomeResponse = await axios.get(`http://localhost:8080/api/income/user?userId=${userId}`);
          // const totalIncome = incomeResponse.data.reduce((acc: number, item: { amount: number }) => acc + item.amount, 0);
          // setTotalIncome(totalIncome);

          // // Fetch expenses data
          // const expensesResponse = await axios.get(`http://localhost:8080/api/expenses/user?userId=${userId}`);
          // const totalExpenses = expensesResponse.data.reduce((acc: number, item: { amount: number }) => acc + item.amount, 0);
          // setTotalExpenses(totalExpenses);

          // Fetch budgets data
          const budgetsResponse = await axios.get(`http://localhost:8080/api/budgets/user?userId=${userId}`);
          setBudgets(budgetsResponse.data);
          console.log("daa" , budgetsResponse.data )

          // Fetch recent transactions
          // const recentResponse = await axios.get(`http://localhost:8080/api/transactions/user?userId=${userId}`);
          // setRecentTransactions(recentResponse.data.slice(0, 5)); // Limit to 5 recent transactions
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button 
        onClick={handleLogout} 
        className="bg-red-500 text-gray px-4 py-2 rounded mb-4"
      >
        Logout
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Income</h2>
          {/* <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p> */}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Expenses</h2>
          {/* <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p> */}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Budgets</h2>
          <ul>
          {budgets.map((budget) => {
      // Make sure to use the correct property names
      const budgetUsage = totalExpenses > 0 ? (totalExpenses / budget.Limit) * 100 : 0;
      return (
        <li key={budget.id} className="flex justify-between">
          <span>{budget.Category} : </span>
          <span>${budget.Limit.toFixed(2)} ({budgetUsage.toFixed(2)}% used)</span>
        </li>
      );
    })}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <ul>
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="flex justify-between">
                <span>{transaction.description}</span>
                <span>${transaction.amount.toFixed(2)} ({transaction.type})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <Link to="/budgets" className="text-blue-500 underline">Manage Budgets</Link>
        <Link to="/expenses" className="text-blue-500 underline ml-4">View Expenses</Link>
        <Link to="/incomes" className="text-blue-500 underline ml-4">View Incomes</Link>
        <Link to="/accounts" className="text-blue-500 underline ml-4">Manage Accounts</Link> {/* Added Accounts Link */}
      </div>
    </div>
  );
};

export default Dashboard;
