// import React from "react";
// import { Link, NavLink } from "react-router-dom";
// console.log("HomeHeader") 
// function HomeHeader() {
//   return (
//     <header className="shadow sticky z-50 top-0">
//       <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
//         <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <img
//               src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
//               className="mr-3 h-12"
//               alt="Logo"
//             />
//           </Link>

//           {/* Right Side Buttons */}
//           <div className="flex items-center lg:order-2">
//             <Link
//               to="/login"
//               className="text-gray-800 hover:bg-gray-100 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
//             >
//               Log in
//             </Link>
//             <Link
//               to="/register"
//               className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
//             >
//               Register
//             </Link>
//           </div>

//           {/* Navigation Links */}
//           <div
//             className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
//             id="mobile-menu-2"
//           >
//             <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
//               <li>
//                 <NavLink
//                   to="/"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   Home
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/about"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   About
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/contact"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   Contact
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/terms"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   Terms
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/privacypolicy"
//                   className={({ isActive }) =>
//                     `block py-2 pr-4 pl-3 duration-200 ${
//                       isActive ? "text-orange-700" : "text-gray-700"
//                     } border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
//                   }
//                 >
//                   Privacy Policy
//                 </NavLink>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

// export default HomeHeader;


import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import  FuelMapLogo from "../Logo/FuelMapLogo.jsx"

function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <nav className="mx-auto max-w-screen-xl px-4 lg:px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          {/* <Link to="/" className="flex items-center group">
            <img
              src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
              className="h-10 group-hover:scale-105 transition-transform duration-300"
              alt="Logo"
            />
          </Link> */}
          


          <Link to="/" className="flex items-center group">
            <FuelMapLogo className="h-10 group-hover:scale-105 transition-transform duration-300" />
          </Link>


          {/* Desktop Navigation Links - Center */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/terms"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              Terms
            </NavLink>
            <NavLink
              to="/privacypolicy"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              Privacy
            </NavLink>
          </div>

          {/* Right Side Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/login"
              className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                      : "text-gray-700 hover:bg-blue-50"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                      : "text-gray-700 hover:bg-blue-50"
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                      : "text-gray-700 hover:bg-blue-50"
                  }`
                }
              >
                Contact
              </NavLink>
              <NavLink
                to="/terms"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                      : "text-gray-700 hover:bg-blue-50"
                  }`
                }
              >
                Terms
              </NavLink>
              <NavLink
                to="/privacypolicy"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                      : "text-gray-700 hover:bg-blue-50"
                  }`
                }
              >
                Privacy
              </NavLink>
              
              <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-center text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default HomeHeader;
