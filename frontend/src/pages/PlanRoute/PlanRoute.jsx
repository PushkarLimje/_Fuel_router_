// src/pages/PlanRoute.jsx
import React, { useState } from "react";

export default function PlanRoute() {
  const [formData, setFormData] = useState({
    start: "",
    destination: "",
    mileage: "",
    fuel: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // later: send this to backend / API
    console.log("Form Data:", formData);
    alert("Route planned! (Mockup)");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      {/* <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Plan Route</h1>
          <nav className="space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            <a href="/stations" className="text-gray-700 hover:text-blue-600">Fuel Stations</a>
          </nav>
        </div>
      </header> */}

      {/* Main Section */}
      <main className="flex-1 max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Route Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4">Enter Trip Details</h2>

          <div>
            <label className="block text-gray-600 mb-1">Start Location</label>
            <input
              type="text"
              name="start"
              value={formData.start}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter starting point"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter destination"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Car Mileage (km/l)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 15"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Fuel Available (litres)</label>
            <input
              type="number"
              name="fuel"
              value={formData.fuel}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 10"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Plan Route
          </button>
        </form>

        {/* Route Preview / Map */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">Route Preview</h2>
          <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            Map will be displayed here
          </div>
        </div>
      </main>
    </div>
  );
}
