// src/pages/PrivacyPolicy.jsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white shadow-md border border-gray-200 rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 border-b pb-3">
          Privacy Policy
        </h1>
        <p className="text-gray-700 mb-4">
          At <span className="font-semibold">Fuel Map Router</span>, we respect your privacy and are committed 
          to protecting your personal information. This Privacy Policy explains 
          how we collect, use, and safeguard your data when you use our services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Personal details such as name, email, and login credentials.</li>
          <li>Location data for route planning and nearby fuel station detection.</li>
          <li>Usage data, including pages visited and features used.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
        <p className="text-gray-700 mb-4">
          We use your information to:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Provide and improve our route planning services.</li>
          <li>Personalize your experience and save trip history.</li>
          <li>Enhance security and prevent unauthorized access.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Sharing of Data</h2>
        <p className="text-gray-700 mb-4">
          We do not sell your personal data. We may share limited data with trusted 
          service providers (such as map APIs) to deliver our services.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Data Security</h2>
        <p className="text-gray-700 mb-4">
          We implement security measures to protect your information. However, no 
          method of transmission over the internet is 100% secure.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Your Rights</h2>
        <p className="text-gray-700 mb-4">
          You may request to access, update, or delete your personal data at any time 
          by contacting our support team.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Changes to this Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update this Privacy Policy from time to time. Any changes will be 
          reflected on this page with an updated revision date.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us at:  
          <br />
          <span className="font-semibold">support@fuelmaprouter.com</span>
        </p>
      </div>
    </div>
  );
}
