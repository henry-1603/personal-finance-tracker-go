import { useEffect, useState } from "react";

interface expenses {
    id: number;
    category: string;
    amount: number;
    description: string;
}

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<expenses[]>([]);

  useEffect(() => {
    // Fetch expenses for the user
    const fetchExpenses = async () => {
      // Add API call here
      const expenses = [
        { id: 1, category: "Groceries", amount: 50, description: "Weekly shopping" },
        { id: 2, category: "Utilities", amount: 100, description: "Electricity bill" },
      ];
      setExpenses(expenses);
    };
    fetchExpenses();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Expenses</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id} className="mb-2">
            <span className="font-bold">{expense.category}</span>: ${expense.amount} - {expense.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
