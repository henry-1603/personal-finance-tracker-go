import { useEffect, useState } from "react";


interface incomes {
    id: number;
    source: string;
    amount: number;
    description: string;
}

const IncomeList = () => {
  const [incomes, setIncomes] = useState<incomes[]>([]);

  useEffect(() => {
    // Fetch incomes for the user
    const fetchIncomes = async () => {
      // Add API call here
      const incomes = [
        { id: 1, source: "Salary", amount: 2000, description: "Monthly salary" },
        { id: 2, source: "Freelance", amount: 500, description: "Project work" },
      ];
      setIncomes(incomes);
    };
    fetchIncomes();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Your Incomes</h2>
      <ul>
        {incomes.map((income) => (
          <li key={income.id} className="mb-2">
            <span className="font-bold">{income.source}</span>: ${income.amount} - {income.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomeList;
