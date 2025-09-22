// src/pages/Dashboard.jsx
import React from "react";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-blue-600 border-b">
          Fuel Map Router
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <a href="/dashboard" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Dashboard</a>
          <a href="/planroute" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Plan Route</a>
          <a href="/fuelstations" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Fuel Stations</a>
          <a href="/triphistory" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Trip History</a>
          <a href="/settings" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Settings</a>
        </nav>
        <div className="p-4 border-t text-gray-600">Logout</div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        {/* <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hello, User</span>
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header> */}

        {/* Content Area */}
        <main className="p-6 flex-1 overflow-y-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-gray-500">Planned Routes</h2>
              <p className="text-3xl font-bold text-blue-600">12</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-gray-500">Fuel Stations</h2>
              <p className="text-3xl font-bold text-green-600">34</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-gray-500">Reports Generated</h2>
              <p className="text-3xl font-bold text-purple-600">7</p>
            </div>
          </div>

          {/* Example Table */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Routes</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Route</th>
                  <th className="p-2">Distance</th>
                  <th className="p-2">Fuel Used</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">Pune → Mumbai</td>
                  <td className="p-2">150 km</td>
                  <td className="p-2">12 L</td>
                  <td className="p-2">01 Sept 2025</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">Delhi → Jaipur</td>
                  <td className="p-2">280 km</td>
                  <td className="p-2">20 L</td>
                  <td className="p-2">28 Aug 2025</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-2">Nagpur → Hyderabad</td>
                  <td className="p-2">500 km</td>
                  <td className="p-2">35 L</td>
                  <td className="p-2">20 Aug 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
