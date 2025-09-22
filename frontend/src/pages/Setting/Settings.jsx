// src/pages/Settings.jsx
import React, { useState } from "react";

export default function Settings() {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    mileage: 15,
    tank: 40,
    darkMode: false,
    notifications: true,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Settings:", formData);
    alert("Settings updated! (Mockup)");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      {/* <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Settings</h1>
          <nav className="space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            <a href="/trip-history" className="text-gray-700 hover:text-blue-600">Trip History</a>
          </nav>
        </div>
      </header> */}

      {/* Main Section */}
      <main className="flex-1 max-w-3xl mx-auto p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md space-y-6"
        >
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

          {/* Profile */}
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Car Settings */}
          <h2 className="text-xl font-semibold mt-6 mb-4">Car Settings</h2>

          <div>
            <label className="block text-gray-600 mb-1">Car Mileage (km/l)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Fuel Tank Capacity (litres)</label>
            <input
              type="number"
              name="tank"
              value={formData.tank}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Preferences */}
          <h2 className="text-xl font-semibold mt-6 mb-4">Preferences</h2>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="darkMode"
              name="darkMode"
              checked={formData.darkMode}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="darkMode" className="text-gray-700">Enable Dark Mode</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="notifications" className="text-gray-700">Enable Notifications</label>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Save Settings
          </button>
        </form>
      </main>
    </div>
  );
}
