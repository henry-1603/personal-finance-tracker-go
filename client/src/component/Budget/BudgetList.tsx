import { useEffect, useState } from "react";

interface budgets {
    id: number;
    category: string;
    limit: number;
}

const BudgetList = () => {
  const [budgets, setBudgets] = useState<budgets[]>([]);

  useEffect(() => {
    // Fetch budgets for the user
    const fetchBudgets = async () => {
      // Add API call here
      const budgets = [
        { id: 1, category: "Groceries", limit: 300 },
        { id: 2, category: "Entertainment", limit: 100 },
      ];
      setBudgets(budgets);
    };
    fetchBudgets();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Budgets</h2>
      <ul>
        {budgets.map((budget) => (
          <li key={budget.id} className="mb-2">
            <span className="font-bold">{budget.category}</span>: ${budget.limit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BudgetList;
