// // src/pages/Dashboard.jsx
// import React from "react";

// useEffect(() => {
//   const fetchDashboardData = async () => {
//     const response = await api.get('/dashboard');
//     // response.data.data contains:
//     // - totalRoutes
//     // - totalReports
//     // - recentRoutes
//     // Update your state and display in UI
//   };
  
//   fetchDashboardData();
// }, []);

// export default function Dashboard() {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md flex flex-col">
//         <div className="p-6 text-2xl font-bold text-blue-600 border-b">
//           Fuel Map Router
//         </div>
//         <nav className="flex-1 p-4 space-y-3">
//           <a href="/dashboard" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Dashboard</a>
//           <a href="/planroute" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Plan Route</a>
//           <a href="/fuelstations" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Fuel Stations</a>
//           <a href="/triphistory" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Trip History</a>
//           <a href="/settings" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Settings</a>
//         </nav>
//         <div className="p-4 border-t text-gray-600">Logout</div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
        
//         {/* Topbar */}
//         {/* <header className="bg-white shadow-md p-4 flex justify-between items-center">
//           <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-600">Hello, User</span>
//             <img
//               src="https://via.placeholder.com/40"
//               alt="User Avatar"
//               className="w-10 h-10 rounded-full border"
//             />
//           </div>
//         </header> */}

//         {/* Content Area */}
//         <main className="p-6 flex-1 overflow-y-auto">
//           {/* Stats Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <h2 className="text-gray-500">Planned Routes</h2>
//               <p className="text-3xl font-bold text-blue-600">12</p>
//             </div>
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <h2 className="text-gray-500">Fuel Stations</h2>
//               <p className="text-3xl font-bold text-green-600">34</p>
//             </div>
//             <div className="bg-white p-6 rounded-xl shadow-md">
//               <h2 className="text-gray-500">Reports Generated</h2>
//               <p className="text-3xl font-bold text-purple-600">7</p>
//             </div>
//           </div>

//           {/* Example Table */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold mb-4">Recent Routes</h2>
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b">
//                   <th className="p-2">Route</th>
//                   <th className="p-2">Distance</th>
//                   <th className="p-2">Fuel Used</th>
//                   <th className="p-2">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-b hover:bg-gray-50">
//                   <td className="p-2">Pune → Mumbai</td>
//                   <td className="p-2">150 km</td>
//                   <td className="p-2">12 L</td>
//                   <td className="p-2">01 Sept 2025</td>
//                 </tr>
//                 <tr className="border-b hover:bg-gray-50">
//                   <td className="p-2">Delhi → Jaipur</td>
//                   <td className="p-2">280 km</td>
//                   <td className="p-2">20 L</td>
//                   <td className="p-2">28 Aug 2025</td>
//                 </tr>
//                 <tr className="hover:bg-gray-50">
//                   <td className="p-2">Nagpur → Hyderabad</td>
//                   <td className="p-2">500 km</td>
//                   <td className="p-2">35 L</td>
//                   <td className="p-2">20 Aug 2025</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


// // src/pages/Dashboard.jsx
// import React, { useState, useEffect } from "react";
// import api from "../../api/axiosConfig.js";

// export default function Dashboard() {
//   const [dashboardData, setDashboardData] = useState({
//     totalRoutes: 0,
//     totalReports: 0,
//     totalFuelStations: 0,
//     recentRoutes: [],
//     userCity: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get('/dashboard');
//         console.log("Dashboard data:", response.data);
        
//         // response.data.data contains the actual data
//         setDashboardData(response.data.data);
//         setError("");
//       } catch (err) {
//         console.error("Error fetching dashboard:", err);
//         setError(err.response?.data?.message || "Failed to load dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchDashboardData();
//   }, []);

//   // Format date helper
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', { 
//       day: '2-digit', 
//       month: 'short', 
//       year: 'numeric' 
//     });
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md flex flex-col">
//         <div className="p-6 text-2xl font-bold text-blue-600 border-b">
//           Fuel Map Router
//         </div>
//         <nav className="flex-1 p-4 space-y-3">
//           <a href="/dashboard" className="block p-2 rounded-lg bg-blue-100 text-blue-700 font-semibold">Dashboard</a>
//           <a href="/planroute" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Plan Route</a>
//           <a href="/fuelstations" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Fuel Stations</a>
//           <a href="/triphistory" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Trip History</a>
//           <a href="/settings" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Settings</a>
//         </nav>
//         <div className="p-4 border-t">
//           <button 
//             onClick={() => {
//               localStorage.clear();
//               window.location.href = '/login';
//             }}
//             className="w-full text-left text-gray-600 hover:text-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Content Area */}
//         <main className="p-6 flex-1 overflow-y-auto">
//           {/* Loading State */}
//           {loading && (
//             <div className="text-center py-10">
//               <p className="text-gray-600">Loading dashboard...</p>
//             </div>
//           )}

//           {/* Error State */}
//           {error && (
//             <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
//               {error}
//             </div>
//           )}

//           {/* Dashboard Content */}
//           {!loading && !error && (
//             <>
//               {/* Stats Section */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div className="bg-white p-6 rounded-xl shadow-md">
//                   <h2 className="text-gray-500">Planned Routes</h2>
//                   <p className="text-3xl font-bold text-blue-600">
//                     {dashboardData.totalRoutes}
//                   </p>
//                 </div>
//                 <div className="bg-white p-6 rounded-xl shadow-md">
//                   <h2 className="text-gray-500">Recent Routes</h2>
//                   <p className="text-3xl font-bold text-green-600">
//                     {dashboardData.totalRecentRoutes}
//                   </p>
//                 </div>
//                 <div className="bg-white p-6 rounded-xl shadow-md">
//                   <h2 className="text-gray-500">Reports Generated</h2>
//                   <p className="text-3xl font-bold text-purple-600">
//                     {dashboardData.totalReports}
//                   </p>
//                 </div>
//               </div>

//               {/* Recent Routes Table */}
//               <div className="bg-white p-6 rounded-xl shadow-md">
//                 <h2 className="text-xl font-semibold mb-4">Recent Routes</h2>
                
//                 {dashboardData.recentRoutes.length === 0 ? (
//                   <p className="text-gray-500 text-center py-8">
//                     No recent routes found. Start by planning a route!
//                   </p>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                       <thead>
//                         <tr className="border-b">
//                           <th className="p-2">Route</th>
//                           <th className="p-2">Distance</th>
//                           <th className="p-2">Fuel Used</th>
//                           <th className="p-2">Date</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {dashboardData.recentRoutes.map((route) => (
//                           <tr key={route._id} className="border-b hover:bg-gray-50">
//                             <td className="p-2">
//                               {route.source} → {route.destination}
//                             </td>
//                             <td className="p-2">{route.distance} km</td>
//                             <td className="p-2">
//                               {route.fuelRequired ? `${route.fuelRequired} L` : 'N/A'}
//                             </td>
//                             <td className="p-2">{formatDate(route.createdAt)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// // src/pages/Dashboard.jsx
// import React, { useState, useEffect } from "react";
// import api from "../../api/axiosConfig"; // Import axios instance

// export default function Dashboard() {
//   const [dashboardData, setDashboardData] = useState({
//     totalRoutes: 0,
//     totalReports: 0,
//     totalFuelStations: 0, // Changed from totalRecentRoutes
//     recentRoutes: [],
//     userCity: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get('/dashboard');
//         console.log("📦 Full response:", response);
//         console.log("📊 Dashboard data:", response.data);
//         console.log("🎯 Actual data:", response.data.data);
        
//         // response.data.data contains the actual data
//         setDashboardData(response.data.data);
//         setError("");
//       } catch (err) {
//         console.error("❌ Error fetching dashboard:", err);
//         console.error("❌ Error response:", err.response);
//         setError(err.response?.data?.message || "Failed to load dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchDashboardData();
//   }, []);

//   // Format date helper
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', { 
//       day: '2-digit', 
//       month: 'short', 
//       year: 'numeric' 
//     });
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md flex flex-col">
//         <div className="p-6 text-2xl font-bold text-blue-600 border-b">
//           Fuel Map Router
//         </div>
//         <nav className="flex-1 p-4 space-y-3">
//           <a href="/dashboard" className="block p-2 rounded-lg bg-blue-100 text-blue-700 font-semibold">Dashboard</a>
//           <a href="/planroute" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Plan Route</a>
//           <a href="/fuelstations" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Fuel Stations</a>
//           <a href="/triphistory" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Trip History</a>
//           <a href="/settings" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Settings</a>
//         </nav>
//         <div className="p-4 border-t">
//           <button 
//             onClick={() => {
//               localStorage.clear();
//               window.location.href = '/login';
//             }}
//             className="w-full text-left text-gray-600 hover:text-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Content Area */}
//         <main className="p-6 flex-1 overflow-y-auto">
//           {/* Loading State */}
//           {loading && (
//             <div className="text-center py-10">
//               <p className="text-gray-600">Loading dashboard...</p>
//             </div>
//           )}

//           {/* Error State */}
//           {error && (
//             <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
//               {error}
//             </div>
//           )}

//           {/* Dashboard Content */}
//           {!loading && !error && (
//             <>
//               {/* Stats Section */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div className="bg-white p-6 rounded-xl shadow-md">
//                   <h2 className="text-gray-500">Planned Routes</h2>
//                   <p className="text-3xl font-bold text-blue-600">
//                     {dashboardData.totalRoutes}
//                   </p>
//                 </div>
//                 <div className="bg-white p-6 rounded-xl shadow-md">
//                   <h2 className="text-gray-500">Recent Routes</h2>
//                   <p className="text-3xl font-bold text-green-600">
//                     {dashboardData.totalRecentRoutes}
//                   </p>
//                 </div>
//                 <div className="bg-white p-6 rounded-xl shadow-md">
//                   <h2 className="text-gray-500">Reports Generated</h2>
//                   <p className="text-3xl font-bold text-purple-600">
//                     {dashboardData.totalReports}
//                   </p>
//                 </div>
//               </div>

//               {/* Recent Routes Table */}
//               <div className="bg-white p-6 rounded-xl shadow-md">
//                 <h2 className="text-xl font-semibold mb-4">Recent Routes</h2>
                
//                 {dashboardData.recentRoutes.length === 0 ? (
//                   <p className="text-gray-500 text-center py-8">
//                     No recent routes found. Start by planning a route!
//                   </p>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                       <thead>
//                         <tr className="border-b">
//                           <th className="p-2">Route</th>
//                           <th className="p-2">Distance</th>
//                           <th className="p-2">Fuel Used</th>
//                           <th className="p-2">Date</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {dashboardData.recentRoutes.map((route) => (
//                           <tr key={route._id} className="border-b hover:bg-gray-50">
//                             <td className="p-2">
//                               {route.source} → {route.destination}
//                             </td>
//                             <td className="p-2">{route.distance} km</td>
//                             <td className="p-2">
//                               {route.fuelRequired ? `${route.fuelRequired} L` : 'N/A'}
//                             </td>
//                             <td className="p-2">{formatDate(route.createdAt)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig"; // Import axios instance

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRoutes: 0,
    totalReports: 0,
    totalFuelStations: 0,
    recentRoutes: [],
    locationInfo: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user's live location first
    const getUserLocation = () => {
      setLocationLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            };
            setUserLocation(location);
            console.log("📍 User location obtained:", location);
            setLocationLoading(false);
          },
          (error) => {
            console.error("❌ Error getting location:", error);
            setLocationLoading(false);
            // Continue without location
          }
        );
      } else {
        console.error("❌ Geolocation not supported");
        setLocationLoading(false);
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Build URL with location if available
        let url = '/dashboard';
        if (userLocation) {
          url += `?lat=${userLocation.lat}&lon=${userLocation.lon}`;
        }
        
        const response = await api.get(url);
        console.log("📦 Full response:", response);
        console.log("📊 Dashboard data:", response.data);
        console.log("🎯 Actual data:", response.data.data);
        
        setDashboardData(response.data.data);
        setError("");
      } catch (err) {
        console.error("❌ Error fetching dashboard:", err);
        console.error("❌ Error response:", err.response);
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch dashboard data after location is obtained or if location fetch fails
    if (!locationLoading) {
      fetchDashboardData();
    }
  }, [userLocation, locationLoading]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 text-2xl font-bold text-blue-600 border-b">
          Fuel Map Router
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <a href="/dashboard" className="block p-2 rounded-lg bg-blue-100 text-blue-700 font-semibold">Dashboard</a>
          <a href="/planroute" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Plan Route</a>
          <a href="/fuelstations" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Fuel Stations</a>
          <a href="/triphistory" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Trip History</a>
          <a href="/settings" className="block p-2 rounded-lg hover:bg-blue-100 text-gray-700">Settings</a>
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="w-full text-left text-gray-600 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <main className="p-6 flex-1 overflow-y-auto">
          {/* Debug Info - Remove after testing */}
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🔧 Debug Info:</h3>
            <p className="text-sm">Location Loading: {locationLoading ? 'Yes' : 'No'}</p>
            <p className="text-sm">User Location: {userLocation ? `${userLocation.lat}, ${userLocation.lon}` : 'Not set'}</p>
            <p className="text-sm">Fuel Stations: {dashboardData.totalFuelStations}</p>
            <button 
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      console.log('✅ Location:', pos.coords);
                      alert(`Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`);
                    },
                    (err) => {
                      console.error('❌ Location error:', err);
                      alert(`Error: ${err.message}`);
                    }
                  );
                } else {
                  alert('Geolocation not supported');
                }
              }}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              Test Location Manually
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-10">
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && !error && (
            <>
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-gray-500">Planned Routes</h2>
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboardData.totalRoutes}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-gray-500">Fuel Stations Near You</h2>
                  <p className="text-3xl font-bold text-green-600">
                    {locationLoading ? "..." : dashboardData.totalFuelStations}
                  </p>
                  {dashboardData.locationInfo && (
                    <p className="text-xs text-gray-500 mt-2">
                      📍 Within 10km of {dashboardData.locationInfo}
                    </p>
                  )}
                  {locationLoading && (
                    <p className="text-xs text-blue-500 mt-2">
                      🔍 Getting your location...
                    </p>
                  )}
                  {!locationLoading && !userLocation && (
                    <p className="text-xs text-amber-500 mt-2">
                      ⚠️ Location access denied
                    </p>
                  )}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h2 className="text-gray-500">Reports Generated</h2>
                  <p className="text-3xl font-bold text-purple-600">
                    {dashboardData.totalReports}
                  </p>
                </div>
              </div>

              {/* Recent Routes Table */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Recent Routes</h2>
                
                {dashboardData.recentRoutes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No recent routes found. Start by planning a route!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="p-2">Route</th>
                          <th className="p-2">Distance</th>
                          <th className="p-2">Fuel Used</th>
                          <th className="p-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentRoutes.map((route) => (
                          <tr key={route._id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              {route.source} → {route.destination}
                            </td>
                            <td className="p-2">{route.distance} km</td>
                            <td className="p-2">
                              {route.fuelRequired ? `${route.fuelRequired} L` : 'N/A'}
                            </td>
                            <td className="p-2">{formatDate(route.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}