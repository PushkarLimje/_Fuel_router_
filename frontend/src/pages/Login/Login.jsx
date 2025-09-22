// src/pages/Login.jsx
import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
 import axios from "axios";
export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Login data:", formData);

  // try {
  //   const response = await fetch("/api/v1/users/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email: formData.email,
  //       password: formData.password,
  //     }),
  //   });
  //   if (!response.ok) {
  //     const errData = await response.json().catch(() => null);
  //     throw new Error(errData?.message || "Login failed");
  //   }
  //   const result = await response.json().catch(() => null);
  //   console.log("Login successful:", result);
  //   alert("Login successful!");
  //   // Navigate to dashboard or home page
  //   navigate("/dashboard");
  // } catch (error) {
  //   console.error(error);
  //   alert(error.message);
  // }
   

  try {
    const response = await axios.post(
      "/api/v1/users/login",
      {
        email: formData.email,
        password: formData.password,
      },
      {
        withCredentials: true, // ✅ very important for cookies
      }
    );
    console.log("Login successful:", response.data);
    alert("Login successful!");
    navigate("/dashboard");
  } catch (error) {
      const message = err.response?.data?.message || err.message || "Login failed";
      console.error("Login error:", err.response || err);
      alert(message);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Fuel Map Router
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Login to your account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
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
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Extra Links */}
        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
