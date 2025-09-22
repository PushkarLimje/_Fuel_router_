// src/pages/Contact.jsx
import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Data:", formData);
    alert("Message sent! (Mockup)");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      {/* <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Contact Us</h1>
          <nav className="space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
          </nav>
        </div>
      </header> */}

      {/* Main Section */}
      <main className="flex-1 max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4"
        >
          <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>

          <div>
            <label className="block text-gray-600 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Write your message..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-4">
              Have questions, feedback, or suggestions? Reach out to us anytime.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li><strong>Email:</strong> support@fuelmaprouter.com</li>
              <li><strong>Phone:</strong> +91 98765 43210</li>
              <li><strong>Address:</strong> Pune, Maharashtra, India</li>
            </ul>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Find us on Map</h2>
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              Map will be displayed here
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-gray-100 py-4 text-center text-gray-600">
        © {new Date().getFullYear()} Fuel Map Router. All rights reserved.
      </footer> */}
    </div>
  );
}
