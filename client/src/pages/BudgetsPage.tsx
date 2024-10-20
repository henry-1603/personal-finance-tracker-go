import BudgetList from '../component/Budget/BudgetList'; // Adjust the import based on your file structure
import { Link } from 'react-router-dom'; // Import Link to handle navigation

const BudgetsPage = () => {
  return (
    <div className='w-[100vw] h-[100vh] bg-[#040F30] p-6'>

    <div className="p-6 max-w-[60%] mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-[2rem] font-bold mb-4">Your Budgets</h1>

      <BudgetList />

      {/* Add Budget Button */}
      <div className="mt-6 flex justify-between">
        <Link
          to="/dashboard"
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </Link>
        <Link
          to="/budgets/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Budget
        </Link>
      </div>
    </div>
    </div>
  );
};

export default BudgetsPage;
