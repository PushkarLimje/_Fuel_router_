// src/pages/Terms.jsx
import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      {/* <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Terms & Conditions</h1>
          <nav className="space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Terms & Conditions
          </h2>

          <p className="text-gray-600 mb-6">
            Welcome to <strong>Fuel Map Router</strong>. By using our application, 
            you agree to the following terms and conditions. Please read them carefully 
            before proceeding.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h3>
          <p className="text-gray-600 mb-6">
            By accessing or using our platform, you agree to comply with these terms and 
            conditions. If you do not agree, you may not use our services.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. User Responsibilities</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
            <li>You agree to provide accurate registration details.</li>
            <li>You are responsible for maintaining account security.</li>
            <li>You agree not to misuse or disrupt the service.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Fuel Station & Route Data</h3>
          <p className="text-gray-600 mb-6">
            While we strive to provide accurate and up-to-date data, we do not guarantee 
            the availability, accuracy, or correctness of fuel prices and station details.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Limitation of Liability</h3>
          <p className="text-gray-600 mb-6">
            Fuel Map Router is not responsible for any losses, damages, or delays caused 
            by reliance on suggested routes or fuel station data.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">5. Modifications</h3>
          <p className="text-gray-600 mb-6">
            We reserve the right to update these terms at any time. Continued use of the 
            app after changes means you accept the updated terms.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">6. Contact Us</h3>
          <p className="text-gray-600">
            If you have any questions about these Terms & Conditions, contact us at{" "}
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
