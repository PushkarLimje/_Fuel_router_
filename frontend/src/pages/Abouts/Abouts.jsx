// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      {/* <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">About</h1>
          <nav className="space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            <a href="/plan" className="text-gray-700 hover:text-blue-600">Plan Route</a>
            <a href="/settings" className="text-gray-700 hover:text-blue-600">Settings</a>
          </nav>
        </div>
      </header> */}

      {/* Main Section */}
      <main className="flex-1 max-w-4xl mx-auto p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            About Fuel Map Router
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Fuel Map Router is a smart route planning application designed to
            help travelers save fuel and money. Our system calculates the most
            fuel-efficient route based on your car’s mileage, fuel tank
            capacity, and available petrol stations along the way.  
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Key Features
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
            <li>Plan fuel-efficient routes based on your car’s mileage</li>
            <li>Find nearby petrol pumps and fuel prices</li>
            <li>Track trip history and fuel consumption</li>
            <li>Customizable settings for personalized trip planning</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Our Mission
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We aim to make road trips smarter, cost-effective, and
            environmentally friendly by reducing unnecessary fuel consumption.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Contact Us
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Have questions or suggestions? Reach us at{" "}
            <a
              href="mailto:support@fuelmaprouter.com"
              className="text-blue-600 hover:underline"
            >
              support@fuelmaprouter.com
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-100 py-4 text-center text-gray-600">
        © {new Date().getFullYear()} Fuel Map Router. All rights reserved.
      </footer> */}
    </div>
  );
}
