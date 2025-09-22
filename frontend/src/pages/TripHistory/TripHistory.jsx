// src/pages/TripHistory.jsx
import React, { useState } from "react";

export default function TripHistory() {
  const [search, setSearch] = useState("");
  const [trips] = useState([
    { id: 1, start: "Pune", destination: "Mumbai", distance: "150 km", fuel: "12 L", date: "01 Sept 2025" },
    { id: 2, start: "Delhi", destination: "Jaipur", distance: "280 km", fuel: "20 L", date: "28 Aug 2025" },
    { id: 3, start: "Nagpur", destination: "Hyderabad", distance: "500 km", fuel: "35 L", date: "20 Aug 2025" },
    { id: 4, start: "Bhopal", destination: "Indore", distance: "190 km", fuel: "15 L", date: "10 Aug 2025" },
  ]);

  // Filter trips by search text
  const filteredTrips = trips.filter(
    (trip) =>
      trip.start.toLowerCase().includes(search.toLowerCase()) ||
      trip.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      {/* <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Trip History</h1>
          <nav className="space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            <a href="/plan" className="text-gray-700 hover:text-blue-600">Plan Route</a>
          </nav>
        </div>
      </header> */}

      {/* Main Section */}
      <main className="flex-1 max-w-6xl mx-auto p-6">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-md mb-6 flex items-center justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Start or Destination..."
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mr-4"
          />
          <button
            onClick={() => setSearch("")}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>

        {/* Trip Table */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Trips</h2>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3">Start</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Distance</th>
                <th className="p-3">Fuel Used</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => (
                  <tr key={trip.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{trip.start}</td>
                    <td className="p-3">{trip.destination}</td>
                    <td className="p-3">{trip.distance}</td>
                    <td className="p-3">{trip.fuel}</td>
                    <td className="p-3">{trip.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No trips found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
