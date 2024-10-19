import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { getBudgets, getExpenses, getIncome } from '../api'; // Assume these functions are defined in your API layer

interface budgets {
    id: number;
    category: string;
    limit: number;
}

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [budgets, setBudgets] = useState<budgets[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const incomeData = await getIncome(); // Fetch income data
//         const expensesData = await getExpenses(); // Fetch expenses data
//         const budgetsData = await getBudgets(); // Fetch budgets data

//         const totalIncome = incomeData.reduce((acc: any, item: { amount: any; }) => acc + item.amount, 0);
//         const totalExpenses = expensesData.reduce((acc: any, item: { amount: any; }) => acc + item.amount, 0);
        
//         setTotalIncome(totalIncome);
//         setTotalExpenses(totalExpenses);
//         setBudgets(budgetsData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

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
          <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total Expenses</h2>
          <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Budgets</h2>
          <ul>
            {budgets.map((budget) => (
              <li key={budget.id} className="flex justify-between">
                <span>{budget.category}</span>
                <span>${budget.limit.toFixed(2)}</span>
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
