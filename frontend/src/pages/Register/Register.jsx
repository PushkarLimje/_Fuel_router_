// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: null,
    password: "",
    confirmPassword: "",
  });

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input for avatar
  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registration Data:", formData);

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      setLoading(true);
      const response = await fetch("/api/v1/users/register", {
        method: "POST",
        body: data, // FormData
      });

      if (!response.ok) {
        const err = await response.json().catch(()=> null);
        throw new Error(err.message || "Registration failed");
      }

      const result = await response.json();
      console.log("User registered:", result);

      // Navigate on success
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }

    // TODO: Call backend API to create user - Done
    // navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Fuel Map Router
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Create an account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {/* Username */}
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
              required
            />
          </div>

          {/* Email */}
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

          {/* Avatar */}
          <div>
            <label className="block text-gray-600 mb-1">Avatar</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
