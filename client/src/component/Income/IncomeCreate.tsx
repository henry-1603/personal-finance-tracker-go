import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { jwtDecode } from "jwt-decode"; // Import jwtDecode to decode the token

const IncomeCreate = () => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function
  const [, setError] = useState<string | null>(null); // State to manage error messages

  const token = localStorage.getItem("token"); // Get the token from local storage
    let userId: string | null = null;

    // Decode the token to get the user ID
    if (token) {
      const decoded: { id: string } = jwtDecode(token);
      userId = decoded.id;
    }

    if (!userId) {
      setError("User ID is required.");
      return;
    }

  const handleCreateIncome = async (e: React.FormEvent) => {
    e.preventDefault();

    const newIncome = {
      userId: userId, // Replace with dynamic user ID
      source,
      amount,
      description,
    };

   


    try {
      const response = await fetch("http://localhost:8080/income/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIncome),
      });

      if (response.ok) {
        // Navigate back to dashboard after successful creation
        navigate("/incomes");
      } else {
        console.error("Failed to create income:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating income:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className='w-[100vw] h-[100vh] bg-[#040F30] p-6'>

    <div className="p-6 max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Income</h2>
      <form onSubmit={handleCreateIncome}>
        <div className="mb-4">
          <label className="block text-gray-700">Source:</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Amount:</label>
          <input
            type="tel"
            className="mt-1 p-2 w-full border rounded-md"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description:</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
        <button
              onClick={() => handleNavigation("/incomes")}
              className="font-bold hover:bg-blue-600 text-red-500 py-2 px-4 rounded transition duration-300"
            >
              Cancel
            </button>
        <button
          type="submit"
          className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
        
            </div>
      </form>
    </div>
    </div>
  );
};

export default IncomeCreate;
