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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <main className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Car Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Car Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Car Mileage (km/l)
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Fuel Tank Capacity (litres)
                </label>
                <input
                  type="number"
                  name="tank"
                  value={formData.tank}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Preferences</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Dark Mode</p>
                    <p className="text-sm text-gray-500">Enable dark theme</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="darkMode"
                    name="darkMode"
                    checked={formData.darkMode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Notifications</p>
                    <p className="text-sm text-gray-500">Receive email notifications</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Settings
            </button>
            <button
              type="button"
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// // src/pages/Settings.jsx
// import React, { useState } from "react";

// export default function Settings() {
//   const [formData, setFormData] = useState({
//     name: "John Doe",
//     email: "john@example.com",
//     mileage: 15,
//     tank: 40,
//     darkMode: false,
//     notifications: true,
//   });

//   const handleChange = (e) => {
//     const { name, type, checked, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Updated Settings:", formData);
//     alert("Settings updated! (Mockup)");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       {/* <header className="bg-white shadow-md">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-blue-600">Settings</h1>
//           <nav className="space-x-6">
//             <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
//             <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
//             <a href="/trip-history" className="text-gray-700 hover:text-blue-600">Trip History</a>
//           </nav>
//         </div>
//       </header> */}

//       {/* Main Section */}
//       <main className="flex-1 max-w-3xl mx-auto p-6">
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-6 rounded-2xl shadow-md space-y-6"
//         >
//           <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

//           {/* Profile */}
//           <div>
//             <label className="block text-gray-600 mb-1">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600 mb-1">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Car Settings */}
//           <h2 className="text-xl font-semibold mt-6 mb-4">Car Settings</h2>

//           <div>
//             <label className="block text-gray-600 mb-1">Car Mileage (km/l)</label>
//             <input
//               type="number"
//               name="mileage"
//               value={formData.mileage}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600 mb-1">Fuel Tank Capacity (litres)</label>
//             <input
//               type="number"
//               name="tank"
//               value={formData.tank}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Preferences */}
//           <h2 className="text-xl font-semibold mt-6 mb-4">Preferences</h2>

//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="darkMode"
//               name="darkMode"
//               checked={formData.darkMode}
//               onChange={handleChange}
//               className="h-4 w-4"
//             />
//             <label htmlFor="darkMode" className="text-gray-700">Enable Dark Mode</label>
//           </div>

//           <div className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               id="notifications"
//               name="notifications"
//               checked={formData.notifications}
//               onChange={handleChange}
//               className="h-4 w-4"
//             />
//             <label htmlFor="notifications" className="text-gray-700">Enable Notifications</label>
//           </div>

//           {/* Save Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Save Settings
//           </button>
//         </form>
//       </main>
//     </div>
//   );
// }
