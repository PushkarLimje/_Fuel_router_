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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col py-12">
      <main className="flex-1 max-w-6xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-600 text-lg">
            Have questions? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Your Email
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

              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="5"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Get in Touch Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
              </div>

              <p className="text-gray-600 mb-6">
                Have questions, feedback, or suggestions? Reach out to us anytime.
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-800 font-semibold">support@fuelmap.com</p>
                  </div>
                </li>

                <li className="flex items-start gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <p className="text-gray-800 font-semibold">+91 98765 43210</p>
                  </div>
                </li>

                <li className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Address</p>
                    <p className="text-gray-800 font-semibold">Pune, Maharashtra, India</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Find us on Map
              </h3>
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="font-medium">Map will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// // src/pages/Contact.jsx
// import React, { useState } from "react";

// export default function Contact() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Contact Form Data:", formData);
//     alert("Message sent! (Mockup)");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       {/* <header className="bg-white shadow-md">
//         <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-blue-600">Contact Us</h1>
//           <nav className="space-x-6">
//             <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
//             <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
//             <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
//           </nav>
//         </div>
//       </header> */}

//       {/* Main Section */}
//       <main className="flex-1 max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Contact Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-white p-6 rounded-2xl shadow-md space-y-4"
//         >
//           <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>

//           <div>
//             <label className="block text-gray-600 mb-1">Your Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your name"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600 mb-1">Your Email</label>
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

//           <div>
//             <label className="block text-gray-600 mb-1">Message</label>
//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               rows="5"
//               placeholder="Write your message..."
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Send Message
//           </button>
//         </form>

//         {/* Contact Info */}
//         <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
//             <p className="text-gray-600 mb-4">
//               Have questions, feedback, or suggestions? Reach out to us anytime.
//             </p>
//             <ul className="space-y-3 text-gray-700">
//               <li><strong>Email:</strong> support@fuelmaprouter.com</li>
//               <li><strong>Phone:</strong> +91 98765 43210</li>
//               <li><strong>Address:</strong> Pune, Maharashtra, India</li>
//             </ul>
//           </div>

//           <div className="mt-6">
//             <h2 className="text-xl font-semibold mb-2">Find us on Map</h2>
//             <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//               Map will be displayed here
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       {/* <footer className="bg-gray-100 py-4 text-center text-gray-600">
//         © {new Date().getFullYear()} Fuel Map Router. All rights reserved.
//       </footer> */}
//     </div>
//   );
// }
