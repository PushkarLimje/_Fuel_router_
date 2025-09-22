// src/pages/Home.jsx
import React from "react";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-md">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-blue-600">Fuel Map Router</h1>
//           <nav className="space-x-6">
//             <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
//             <a href="/plan" className="text-gray-700 hover:text-blue-600">Plan Route</a>
//             <a href="/stations" className="text-gray-700 hover:text-blue-600">Fuel Stations</a>
//             <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
//           </nav>
//         </div>
//       </header>
//       {/* Hero Section */}
//       <main className="flex-1 flex items-center justify-center text-center px-6">
//         <div className="max-w-3xl">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
//             Smart Fuel-Efficient Route Planner
//           </h2>
//           <p className="text-lg text-gray-600 mb-8">
//             Plan your trips with real-time fuel optimization and find the best petrol pump stops
//             along your route.
//           </p>
//           <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition text-lg">
//             Get Started
//           </button>
//         </div>
//       </main>
//       {/* Footer */}
//       <footer className="bg-gray-100 py-4 text-center text-gray-600">
//         © {new Date().getFullYear()} Fuel Map Router. All rights reserved.
//       </footer>
//     </div>
//   );
// }

// src/pages/Home.jsx

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center text-center px-6 bg-gray-50">
      <div className="max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Smart Fuel-Efficient Route Planner
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Plan your trips with real-time fuel optimization and find the best petrol pump stops
          along your route.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition text-lg">
          Get Started
        </button>
      </div>
    </main>
  );
}
