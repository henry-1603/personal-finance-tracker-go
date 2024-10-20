import { useEffect, useState } from "react";
import IncomeUpdateModal from "./IncomeUpdateModal";
import { jwtDecode } from "jwt-decode"; // Corrected import for jwtDecode

interface Income {
  ID: string;
  Source: string;
  Amount: number;
  Description: string;
  Date?: Date; // Make Date optional
}

const IncomeList = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  let userId: string | null = null;

  if (token) {
    const decoded: { id: string } = jwtDecode(token);
    userId = decoded.id;
  }

  if (!userId) {
    setError("User ID is required.");
    return null; // Return null if no user ID
  }

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/income/user?user_id=${userId}`
        );
        const data = await response.json();
        setIncomes(data);
      } catch (error) {
        console.error("Error fetching incomes:", error);
      }
    };
    fetchIncomes();
  }, [userId]);

  const handleDeleteIncome = async (incomeId: string) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        await fetch(`http://localhost:8080/income/delete?id=${incomeId}`, {
          method: "DELETE",
        });
        setIncomes(incomes.filter((income) => income.ID !== incomeId));
      } catch (error) {
        console.error("Error deleting income:", error);
      }
    }
  };

  const openUpdateModal = (income: Income) => {
    console.log("hello");
    setSelectedIncome(income);
    setIsUpdateModalOpen(true);
  console.log(isUpdateModalOpen,selectedIncome);

  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedIncome(null);
  };

  const handleUpdate = (updatedIncome: Income) => {
    setIncomes((prev) =>
      prev.map((income) =>
        income.ID === updatedIncome.ID ? updatedIncome : income
      )
    );
  };

  return (
    <div className="p-6 max-w-full-auto bg-white rounded-lg shadow-md">
      {incomes.length === 0 ? (
        <p>No incomes found.</p>
      ) : (
        <ul>
          {incomes.map((income) => (
            <li key={income.ID} className="flex justify-between mb-2">
              <span className="flex flex-row space-x-[2rem]">
              <span className="text-xl font-bold">{income.Source}  :</span> 
              <span className="text-xl font-bold"> ${income.Amount} (
              {income.Description})

              </span>
              </span>
              <div>
              <button
                onClick={() => openUpdateModal(income)}
                className="bg-yellow-500 text-black px-3 py-2 font-bold rounded mr-2"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteIncome(income.ID)}
                className="bg-red-500 text-white px-3 py-2 font-bold rounded"
              >
                Delete
              </button>
              </div>
            </li>
          ))}
        </ul>
      )}

{isUpdateModalOpen && selectedIncome && (
  <>
    {console.log("Rendering Modal")}
    <IncomeUpdateModal
      income={selectedIncome}
      onClose={closeUpdateModal}
      onUpdate={handleUpdate}
    />
  </>
)}

    </div>
  );
};

export default IncomeList;
