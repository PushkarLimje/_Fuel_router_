import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, {
        withCredentials: true, // important for sending/clearing cookies
      });

      // Redirect user to login page
      alert("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed",error.response || error);
      alert(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="flex items-center lg:order-2">
      <button
        onClick={handleLogout}
        className="group relative text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 lg:px-6 lg:py-3 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none overflow-hidden"
      >
        {/* Shimmer effect */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        
        {/* Button content */}
        <span className="relative flex items-center gap-2">
          <svg 
            className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          Logout
        </span>
      </button>
    </div>
  );

  // return (
  //   <div className="flex items-center lg:order-2">
  //     <button
  //       onClick={handleLogout}
  //       className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 mr-2 focus:outline-none"
  //     >
  //       Logout
  //     </button>
  //   </div>
  // );
}

export default LogoutButton;
