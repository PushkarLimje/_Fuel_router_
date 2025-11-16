// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../../Components/Notifications';
import { useToastContext } from "../../Components/ToastContext.jsx"; // Same folder 

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //const { showToast, ToastContainer } = useToast();
  const { showToast } = useToastContext();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: null,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      // alert("Passwords do not match!");
      showToast("Passwords do not match!", 'error');
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
        body: data,
      });

      if (!response.ok) {
        const err = await response.json().catch(()=> null);
        throw new Error(err.message || "Registration failed");
      }

      const result = await response.json();
      console.log("User registered:", result);

      //! navigate("/dashboard");
      showToast('Account created successfully! Welcome aboard.', 'success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error(error);
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg relative z-10 border border-gray-100 my-8">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join FuelMap and start your journey
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="johndoe"
              required
            />
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Profile Picture
            </label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">PNG, JPG or JPEG (Max 5MB)</p>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Confirm
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Extra Links */}
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
            Login
          </a>
        </p>
      </div>
      {/* <ToastContainer /> */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}


// // src/pages/Register.jsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Register() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     username: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     avatar: null,
//     password: "",
//     confirmPassword: "",
//   });

//   // Handle text inputs
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle file input for avatar
//   const handleFileChange = (e) => {
//     setFormData({ ...formData, avatar: e.target.files[0] });
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match!");
//       return;
//     }

//     console.log("Registration Data:", formData);

//     const data = new FormData();
//     for (let key in formData) {
//       data.append(key, formData[key]);
//     }

//     try {
//       setLoading(true);
//       const response = await fetch("/api/v1/users/register", {
//         method: "POST",
//         body: data, // FormData
//       });

//       if (!response.ok) {
//         const err = await response.json().catch(()=> null);
//         throw new Error(err.message || "Registration failed");
//       }

//       const result = await response.json();
//       console.log("User registered:", result);

//       // Navigate on success
//       navigate("/dashboard");
//     } catch (error) {
//       console.error(error);
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }

//     // TODO: Call backend API to create user - Done
//     // navigate("/dashboard");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
//         <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
//           Fuel Map Router
//         </h1>
//         <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
//           Create an account
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//           {/* Username */}
//           <div>
//             <label className="block text-gray-600 mb-1">Username</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter username"
//               required
//             />
//           </div>

//           {/* First Name */}
//           <div>
//             <label className="block text-gray-600 mb-1">First Name</label>
//             <input
//               type="text"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter first name"
//               required
//             />
//           </div>

//           {/* Last Name */}
//           <div>
//             <label className="block text-gray-600 mb-1">Last Name</label>
//             <input
//               type="text"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter last name"
//               required
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-gray-600 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           {/* Avatar */}
//           <div>
//             <label className="block text-gray-600 mb-1">Avatar</label>
//             <input
//               type="file"
//               name="avatar"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-gray-600 mb-1">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter password"
//               required
//             />
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-gray-600 mb-1">Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Re-enter password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Register
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-4">
//           Already have an account?{" "}
//           <a href="/login" className="text-blue-600 hover:underline">
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }
