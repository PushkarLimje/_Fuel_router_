// export default LogoutButton;

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../ToastContext"; // or "../ToastContext"

function LogoutButton() {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, {
        withCredentials: true,
      });

      // Show toast first
      showToast('Logged out successfully!', 'success');
      
      // ✅ ADD DELAY before navigation (let toast show for 1.5 seconds)
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error) {
      console.error("Logout failed", error.response || error);
      showToast(error.response?.data?.message || "Logout failed", 'error');
      
      // For errors, also add a small delay if you want to navigate
      // Or don't navigate at all on error
    }
  };

  return (
    <div className="flex items-center lg:order-2">
      <button
        onClick={handleLogout}
        className="group relative text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 lg:px-6 lg:py-3 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none overflow-hidden"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
        
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
}

export default LogoutButton;