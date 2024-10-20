import IncomeList from '../component/Income/IncomeList'; // Adjust the import based on your file structure
import { Link } from 'react-router-dom'; // Import Link to handle navigation

const BudgetsPage = () => {
  return (
    <div className='w-[100vw] h-[100vh] bg-[#040F30] p-6'>
    <div className="p-6 max-w-[60%] p-6 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-[2rem] w-full font-bold mb-4">Your Incomes</h1>

      <IncomeList />

      {/* Add Budget Button */}
      <div className="mt-6 flex justify-between">
        <Link
          to="/dashboard"
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </Link>
        <Link
          to="/incomes/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Income
        </Link>
      </div>
    </div>
    </div>
  );
};

export default BudgetsPage;
