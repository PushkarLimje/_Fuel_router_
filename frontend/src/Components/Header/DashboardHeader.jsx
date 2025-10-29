import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LogoutButton from '../Logoutbutton/LogoutButton.jsx'
import FuelMapLogo from "../Logo/FuelMapLogo.jsx"

function DashboardHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Clear session/auth here
    console.log("User logged out");
    navigate("/login");
  };
  
  console.log("DashboardHeader")
  
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-lg border-b border-gray-200">
      <nav className="px-4 lg:px-6 py-3">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* Logo with enhanced styling */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-all duration-300"></div>
              <FuelMapLogo className="relative h-12 group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
            </div>
          </Link>

          {/* Logout Button with better spacing */}
          <div className="flex items-center lg:order-2">
            <LogoutButton/>
          </div>

          {/* Navigation Links with modern styling */}
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-2 lg:mt-0">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block py-2.5 px-4 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "text-orange-600 bg-orange-50 font-semibold shadow-sm" 
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/planroute"
                  className={({ isActive }) =>
                    `block py-2.5 px-4 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "text-orange-600 bg-orange-50 font-semibold shadow-sm" 
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50"
                    }`
                  }
                >
                  Plan Route
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/fuelstations"
                  className={({ isActive }) =>
                    `block py-2.5 px-4 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "text-orange-600 bg-orange-50 font-semibold shadow-sm" 
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50"
                    }`
                  }
                >
                  Fuel Stations
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/triphistory"
                  className={({ isActive }) =>
                    `block py-2.5 px-4 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "text-orange-600 bg-orange-50 font-semibold shadow-sm" 
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50"
                    }`
                  }
                >
                  Trip History
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `block py-2.5 px-4 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "text-orange-600 bg-orange-50 font-semibold shadow-sm" 
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/50"
                    }`
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

// import React from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import LogoutButton from '../Logoutbutton/LogoutButton.jsx'
// import  FuelMapLogo from "../Logo/FuelMapLogo.jsx"
// function DashboardHeader() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // TODO: Clear session/auth here
//     console.log("User logged out");
//     navigate("/login");
//   };
//   console.log("DashboardHeader")
//   return (
//     <header className="shadow sticky z-50 top-0">
//       <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
//         <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
//           {/* Logo */}
//           {/* <Link to="/api/v1/users/dashboard" className="flex items-center">
//             <img
//               src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
//               className="mr-3 h-12"
//               alt="Logo"
//             />
//           </Link> */}
//           <Link to="/" className="flex items-center group">
//             <FuelMapLogo className="h-10 group-hover:scale-105 transition-transform duration-300" />
//           </Link>

//           {/* Right-side: Logout Button */}
//           {/* <div className="flex items-center lg:order-2">
//             <button
//             to="/logout"
//               // onClick={handleLogout}
//               className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 lg:px-5 lg:py-2.5 mr-2 focus:outline-none"
//             >
//               Logout
//             </button>
//           </div> */}
          
//           <LogoutButton/>

//           {/* Navigation Links */}
//           <div
//             className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
//             id="mobile-menu-2"
//           >
//             <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
//               <li>
//                 <NavLink
//                   to="/dashboard"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   Dashboard
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/planroute"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   Plan Route
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/fuelstations"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   Fuel Stations
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/triphistory"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   Trip History
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/settings"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   Settings
//                 </NavLink>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default DashboardHeader;
