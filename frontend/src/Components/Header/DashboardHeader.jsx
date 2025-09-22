import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LogoutButton from '../Logoutbutton/LogoutButton.jsx'
function DashboardHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Clear session/auth here
    console.log("User logged out");
    navigate("/login");
  };
  console.log("DashboardHeader")
  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo */}
          <Link to="/api/v1/users/dashboard" className="flex items-center">
            <img
              src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
              className="mr-3 h-12"
              alt="Logo"
            />
          </Link>

          {/* Right-side: Logout Button */}
          {/* <div className="flex items-center lg:order-2">
            <button
            to="/logout"
              // onClick={handleLogout}
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 mr-2 focus:outline-none"
            >
              Logout
            </button>
          </div> */}
          
          <LogoutButton/>

          {/* Navigation Links */}
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-orange-700" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/planroute"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-orange-700" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                  }
                >
                  Plan Route
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/fuelstations"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-orange-700" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                  }
                >
                  Fuel Stations
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/triphistory"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-orange-700" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                  }
                >
                  Trip History
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 ${
                      isActive ? "text-orange-700" : "text-gray-700"
                    } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                  }
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default DashboardHeader;
