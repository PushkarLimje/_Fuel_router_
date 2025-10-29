// // src/pages/Dashboard.jsx
// import React, { useState, useEffect } from "react";
// import api from "../../api/axiosConfig"; // Import axios instance

// export default function Dashboard() {
//   const [dashboardData, setDashboardData] = useState({
//     totalRoutes: 0,
//     totalReports: 0,
//     totalFuelStations: 0,
//     recentRoutes: [],
//     locationInfo: ''
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [userLocation, setUserLocation] = useState(null);

//   useEffect(() => {
//     // Get user's live location first
//     const getUserLocation = () => {
//       setLocationLoading(true);
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const location = {
//               lat: position.coords.latitude,
//               lon: position.coords.longitude
//             };
//             setUserLocation(location);
//             console.log("📍 User location obtained:", location);
//             setLocationLoading(false);
//           },
//           (error) => {
//             console.error("❌ Error getting location:", error);
//             setLocationLoading(false);
//             // Continue without location
//           }
//         );
//       } else {
//         console.error("❌ Geolocation not supported");
//         setLocationLoading(false);
//       }
//     };

//     getUserLocation();
//   }, []);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);
        
//         // Build URL with location if available
//         let url = '/dashboard';
//         if (userLocation) {
//           url += `?lat=${userLocation.lat}&lon=${userLocation.lon}`;
//         }
        
//         const response = await api.get(url);
//         console.log("📦 Full response:", response);
//         console.log("📊 Dashboard data:", response.data);
//         console.log("🎯 Actual data:", response.data.data);
        
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
    
//     // Fetch dashboard data after location is obtained or if location fetch fails
//     if (!locationLoading) {
//       fetchDashboardData();
//     }
//   }, [userLocation, locationLoading]);

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
//           {/* Debug Info - Remove after testing */}
//           <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <h3 className="font-semibold text-yellow-800 mb-2">🔧 Debug Info:</h3>
//             <p className="text-sm">Location Loading: {locationLoading ? 'Yes' : 'No'}</p>
//             <p className="text-sm">User Location: {userLocation ? `${userLocation.lat}, ${userLocation.lon}` : 'Not set'}</p>
//             <p className="text-sm">Fuel Stations: {dashboardData.totalFuelStations}</p>
//             <button 
//               onClick={() => {
//                 if (navigator.geolocation) {
//                   navigator.geolocation.getCurrentPosition(
//                     (pos) => {
//                       console.log('✅ Location:', pos.coords);
//                       alert(`Lat: ${pos.coords.latitude}, Lon: ${pos.coords.longitude}`);
//                     },
//                     (err) => {
//                       console.error('❌ Location error:', err);
//                       alert(`Error: ${err.message}`);
//                     }
//                   );
//                 } else {
//                   alert('Geolocation not supported');
//                 }
//               }}
//               className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
//             >
//               Test Location Manually
//             </button>
//           </div>

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
//                   <h2 className="text-gray-500">Fuel Stations Near You</h2>
//                   <p className="text-3xl font-bold text-green-600">
//                     {locationLoading ? "..." : dashboardData.totalFuelStations}
//                   </p>
//                   {dashboardData.locationInfo && (
//                     <p className="text-xs text-gray-500 mt-2">
//                       📍 Within 10km of {dashboardData.locationInfo}
//                     </p>
//                   )}
//                   {locationLoading && (
//                     <p className="text-xs text-blue-500 mt-2">
//                       🔍 Getting your location...
//                     </p>
//                   )}
//                   {!locationLoading && !userLocation && (
//                     <p className="text-xs text-amber-500 mt-2">
//                       ⚠️ Location access denied
//                     </p>
//                   )}
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
import api from "../../api/axiosConfig";

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
    
    if (!locationLoading) {
      fetchDashboardData();
    }
  }, [userLocation, locationLoading]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            FuelMap
          </h1>
          <p className="text-xs text-gray-500 mt-1">Smart Routing</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="/dashboard" className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </a>
          
          <a href="/planroute" className="group flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span className="font-medium">Plan Route</span>
          </a>
          
          <a href="/fuelstations" className="group flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Fuel Stations</span>
          </a>
          
          <a href="/triphistory" className="group flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Trip History</span>
          </a>
          
          <a href="/settings" className="group flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Settings</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Welcome back! Here's your overview</p>
            </div>
            <div className="flex items-center gap-3">
              {locationLoading && (
                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting location...
                </div>
              )}
              {userLocation && (
                <div className="flex items-center gap-2 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Location Active
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 flex-1 overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Error loading dashboard</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && !error && (
            <>
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Planned Routes Card */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Planned Routes</h3>
                  <p className="text-3xl font-bold text-blue-600">{dashboardData.totalRoutes}</p>
                </div>

                {/* Fuel Stations Card */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-xl group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Fuel Stations Near You</h3>
                  <p className="text-3xl font-bold text-green-600">
                    {locationLoading ? "..." : dashboardData.totalFuelStations}
                  </p>
                  {dashboardData.locationInfo && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Within 10km of {dashboardData.locationInfo}
                    </p>
                  )}
                  {locationLoading && (
                    <p className="text-xs text-blue-500 mt-2">🔍 Getting your location...</p>
                  )}
                  {!locationLoading && !userLocation && (
                    <p className="text-xs text-amber-500 mt-2">⚠️ Location access denied</p>
                  )}
                </div>

                {/* Reports Card */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Reports Generated</h3>
                  <p className="text-3xl font-bold text-purple-600">{dashboardData.totalReports}</p>
                </div>
              </div>

              {/* Recent Routes Table */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent Routes
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Your latest planned routes</p>
                </div>
                
                {dashboardData.recentRoutes.length === 0 ? (
                  <div className="p-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-gray-500 font-medium">No recent routes found</p>
                    <p className="text-gray-400 text-sm mt-1">Start by planning a route!</p>
                    <a href="/planroute" className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
                      Plan Your First Route
                    </a>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Route</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Distance</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fuel Used</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dashboardData.recentRoutes.map((route, index) => (
                          <tr key={route._id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800">{route.source}</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                                <span className="font-medium text-gray-800">{route.destination}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                {route.distance} km
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-700 font-medium">
                                {route.fuelRequired ? `${route.fuelRequired} L` : 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-500 text-sm">{formatDate(route.createdAt)}</span>
                            </td>
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