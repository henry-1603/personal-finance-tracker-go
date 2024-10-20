import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming the token is stored here after login
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#040F30] flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Personal Finance Tracker!</h1>
      <div className="space-y-4">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <button className="px-6 py-2 bg-blue-500 text-gray rounded hover:bg-blue-600">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="px-6 py-2 bg-green text-gray rounded hover:bg-green-600">
                Register
              </button>
            </Link>
          </>
        ) : (
          <Link to="/dashboard">
            <button className="px-6 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              Go to Dashboard
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
