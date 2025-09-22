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
      navigate("/login");
    } catch (error) {
      console.error("Logout failed",error.response || error);
      alert(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="flex items-center lg:order-2">
      <button
        onClick={handleLogout}
        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 mr-2 focus:outline-none"
      >
        Logout
      </button>
    </div>
  );
}

export default LogoutButton;
