
// // src/pages/TripHistory.jsx
// import React, { useState, useEffect } from "react";
// import api from "../api/axiosConfig";

// export default function TripHistory() {
//   const [search, setSearch] = useState("");
//   const [routes, setRoutes] = useState([]);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generating, setGenerating] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Create a test route
//   const createTestRoute = async () => {
//     try {
//       const testRoute = {
//         source: "Mumbai",
//         destination: "Pune",
//         distance: 148.5,
//         duration: 180,
//         fuelRequired: 12.5,
//         pathCoordinates: [
//           { lat: 19.0760, lng: 72.8777 },
//           { lat: 18.5204, lng: 73.8567 }
//         ]
//       };
      
//       console.log("Creating test route:", testRoute);
//       const response = await api.post('/routes', testRoute);
//       console.log("Test route created:", response.data);
//       alert("Test route created! Refreshing...");
//       fetchData();
//     } catch (error) {
//       console.error("Error creating test route:", error);
//       alert(error.response?.data?.message || "Failed to create test route");
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       console.log("🔍 Fetching routes and reports...");
      
//       // Fetch routes
//       const routesRes = await api.get('/routes');
//       console.log("📊 Routes response:", routesRes.data);
//       setRoutes(routesRes.data.data || []);
//       console.log("✅ Loaded routes:", routesRes.data.data?.length || 0);
      
//       // Try to fetch reports (optional - won't break if endpoint doesn't exist)
//       try {
//         const reportsRes = await api.get('/reports');
//         console.log("📋 Reports response:", reportsRes.data);
//         setReports(reportsRes.data.data || []);
//         console.log("✅ Loaded reports:", reportsRes.data.data?.length || 0);
//       } catch (reportError) {
//         console.warn("⚠️ Reports endpoint not available yet:", reportError.message);
//         setReports([]);
//       }
      
//     } catch (error) {
//       console.error("❌ Error fetching data:", error);
//       console.error("❌ Error response:", error.response);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Generate report for a route
//   const handleGenerateReport = async (routeId) => {
//     const fuelPrice = prompt("Enter fuel price per liter (₹):", "100");
//     if (!fuelPrice) return;

//     setGenerating(routeId);
//     try {
//       const response = await api.post(`/reports/generate/${routeId}`, {
//         fuelPricePerLiter: parseFloat(fuelPrice)
//       });
      
//       alert("Report generated successfully!");
//       fetchData(); // Refresh data
//     } catch (error) {
//       console.error("Error generating report:", error);
//       alert(error.response?.data?.message || "Failed to generate report");
//     } finally {
//       setGenerating(null);
//     }
//   };

//   // Download report
//   const handleDownloadReport = (reportId) => {
//     window.open(`http://localhost:8000/api/v1/reports/download/${reportId}`, '_blank');
//   };

//   // Check if route has a report
//   const hasReport = (routeId) => {
//     return reports.some(r => r.routeId === routeId || r.routeId._id === routeId);
//   };

//   // Get report for a route
//   const getReport = (routeId) => {
//     return reports.find(r => r.routeId === routeId || r.routeId._id === routeId);
//   };

//   // Filter routes by search
//   const filteredRoutes = routes.filter(
//     (route) =>
//       route.source.toLowerCase().includes(search.toLowerCase()) ||
//       route.destination.toLowerCase().includes(search.toLowerCase())
//   );

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-gray-600">Loading trip history...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <main className="flex-1 max-w-6xl mx-auto p-6">
//         {/* Search Bar */}
//         <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search by Start or Destination..."
//               className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mr-4"
//             />
//             <button
//               onClick={() => setSearch("")}
//               className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//             >
//               Clear
//             </button>
//           </div>
          
//           {/* Debug buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={createTestRoute}
//               className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
//             >
//               🧪 Create Test Route
//             </button>
//             <button
//               onClick={fetchData}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
//             >
//               🔄 Refresh Data
//             </button>
//             <button
//               onClick={() => {
//                 console.log('Routes:', routes);
//                 console.log('Reports:', reports);
//                 console.log('Token:', localStorage.getItem('accessToken'));
//               }}
//               className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 text-sm"
//             >
//               🔍 Debug Info
//             </button>
//           </div>
//         </div>

//         {/* Trip Table */}
//         <div className="bg-white p-6 rounded-2xl shadow-md">
//           <h2 className="text-xl font-semibold mb-4">Your Trips</h2>
          
//           {filteredRoutes.length === 0 ? (
//             <p className="text-center text-gray-500 py-8">
//               No trips found. Start by planning a route!
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-left">
//                 <thead>
//                   <tr className="border-b bg-gray-100">
//                     <th className="p-3">Start</th>
//                     <th className="p-3">Destination</th>
//                     <th className="p-3">Distance</th>
//                     <th className="p-3">Fuel Used</th>
//                     <th className="p-3">Date</th>
//                     <th className="p-3">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredRoutes.map((route) => {
//                     const report = getReport(route._id);
//                     return (
//                       <tr key={route._id} className="border-b hover:bg-gray-50">
//                         <td className="p-3">{route.source}</td>
//                         <td className="p-3">{route.destination}</td>
//                         <td className="p-3">{route.distance} km</td>
//                         <td className="p-3">
//                           {route.fuelRequired ? `${route.fuelRequired} L` : 'N/A'}
//                         </td>
//                         <td className="p-3">{formatDate(route.createdAt)}</td>
//                         <td className="p-3">
//                           {report ? (
//                             <button
//                               onClick={() => handleDownloadReport(report._id)}
//                               className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
//                             >
//                               📥 Download Report
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleGenerateReport(route._id)}
//                               disabled={generating === route._id}
//                               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400 text-sm"
//                             >
//                               {generating === route._id ? "Generating..." : "📊 Generate Report"}
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Reports Section */}
//         {reports.length > 0 && (
//           <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
//             <h2 className="text-xl font-semibold mb-4">Generated Reports</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {reports.map((report) => (
//                 <div key={report._id} className="border rounded-lg p-4 hover:shadow-md transition">
//                   <h3 className="font-semibold text-gray-800 mb-2">
//                     {report.source} → {report.destination}
//                   </h3>
//                   <div className="text-sm text-gray-600 space-y-1">
//                     <p>Distance: {report.distance} km</p>
//                     <p>Fuel Used: {report.fuelUsed} L</p>
//                     <p>Cost: ₹{report.fuelCost}</p>
//                     <p className="text-xs text-gray-400">
//                       {formatDate(report.generatedAt)}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleDownloadReport(report._id)}
//                     className="mt-3 w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
//                   >
//                     📥 Download PDF
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// src/pages/TripHistory.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";

export default function TripHistory() {
  const [search, setSearch] = useState("");
  const [routes, setRoutes] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Create a test route
  const createTestRoute = async () => {
    try {
      const testRoute = {
        source: "Mumbai",
        destination: "Pune",
        distance: 148.5,
        duration: 180,
        fuelRequired: 12.5,
        pathCoordinates: [
          { lat: 19.0760, lng: 72.8777 },
          { lat: 18.5204, lng: 73.8567 }
        ]
      };
      
      console.log("Creating test route:", testRoute);
      const response = await api.post('/routes', testRoute);
      console.log("Test route created:", response.data);
      alert("Test route created! Refreshing...");
      fetchData();
    } catch (error) {
      console.error("Error creating test route:", error);
      alert(error.response?.data?.message || "Failed to create test route");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching routes and reports...");
      
      // Fetch routes
      const routesRes = await api.get('/routes');
      console.log("📊 Routes response:", routesRes.data);
      setRoutes(routesRes.data.data || []);
      console.log("✅ Loaded routes:", routesRes.data.data?.length || 0);
      
      // Try to fetch reports (optional - won't break if endpoint doesn't exist)
      try {
        const reportsRes = await api.get('/reports');
        console.log("📋 Reports response:", reportsRes.data);
        setReports(reportsRes.data.data || []);
        console.log("✅ Loaded reports:", reportsRes.data.data?.length || 0);
      } catch (reportError) {
        console.warn("⚠️ Reports endpoint not available yet:", reportError.message);
        setReports([]);
      }
      
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      console.error("❌ Error response:", error.response);
    } finally {
      setLoading(false);
    }
  };

  // Generate report for a route
  const handleGenerateReport = async (routeId) => {
    const fuelPrice = prompt("Enter fuel price per liter (₹):", "100");
    if (!fuelPrice) return;

    setGenerating(routeId);
    try {
      const response = await api.post(`/reports/generate/${routeId}`, {
        fuelPricePerLiter: parseFloat(fuelPrice)
      });
      
      alert("Report generated successfully!");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error generating report:", error);
      alert(error.response?.data?.message || "Failed to generate report");
    } finally {
      setGenerating(null);
    }
  };

  // Download report
  const handleDownloadReport = async (reportId) => {
    try {
      // Method 1: Direct download through backend
      window.open(`http://localhost:8000/api/v1/reports/download/${reportId}`, '_blank');
      
      // Method 2: Force download with fetch (uncomment if needed)
      // const response = await fetch(`http://localhost:8000/api/v1/reports/download/${reportId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      //   }
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `report_${reportId}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report");
    }
  };

  // Check if route has a report
  const hasReport = (routeId) => {
    return reports.some(r => r.routeId === routeId || r.routeId._id === routeId);
  };

  // Get report for a route
  const getReport = (routeId) => {
    return reports.find(r => r.routeId === routeId || r.routeId._id === routeId);
  };

  // Filter routes by search
  const filteredRoutes = routes.filter(
    (route) =>
      route.source.toLowerCase().includes(search.toLowerCase()) ||
      route.destination.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading trip history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto p-6">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Start or Destination..."
              className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mr-4"
            />
            <button
              onClick={() => setSearch("")}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
          
          {/* Debug buttons */}
          <div className="flex gap-2">
            <button
              onClick={createTestRoute}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
            >
              🧪 Create Test Route
            </button>
            <button
              onClick={fetchData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
            >
              🔄 Refresh Data
            </button>
            <button
              onClick={() => {
                console.log('Routes:', routes);
                console.log('Reports:', reports);
                console.log('Token:', localStorage.getItem('accessToken'));
              }}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 text-sm"
            >
              🔍 Debug Info
            </button>
          </div>
        </div>

        {/* Trip Table */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Trips</h2>
          
          {filteredRoutes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No trips found. Start by planning a route!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-3">Start</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Distance</th>
                    <th className="p-3">Fuel Used</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route) => {
                    const report = getReport(route._id);
                    return (
                      <tr key={route._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{route.source}</td>
                        <td className="p-3">{route.destination}</td>
                        <td className="p-3">{route.distance} km</td>
                        <td className="p-3">
                          {route.fuelRequired ? `${route.fuelRequired} L` : 'N/A'}
                        </td>
                        <td className="p-3">{formatDate(route.createdAt)}</td>
                        <td className="p-3">
                          {report ? (
                            <button
                              onClick={() => handleDownloadReport(report._id)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                            >
                              📥 Download Report
                            </button>
                          ) : (
                            <button
                              onClick={() => handleGenerateReport(route._id)}
                              disabled={generating === route._id}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400 text-sm"
                            >
                              {generating === route._id ? "Generating..." : "📊 Generate Report"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reports Section */}
        {reports.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
            <h2 className="text-xl font-semibold mb-4">Generated Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <div key={report._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {report.source} → {report.destination}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Distance: {report.distance} km</p>
                    <p>Fuel Used: {report.fuelUsed} L</p>
                    <p>Cost: ₹{report.fuelCost}</p>
                    <p className="text-xs text-gray-400">
                      {formatDate(report.generatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(report._id)}
                    className="mt-3 w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                  >
                    📥 Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}