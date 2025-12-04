// src/pages/TripHistory.jsx
import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Search, X, FileText, Download, Calendar, MapPin, Fuel, Route as RouteIcon, RefreshCw, TestTube, Bug, Loader2, Plus } from "lucide-react";
import GenerateReportModal from "../../Components/GenerateReportModal.jsx";
import { useToast } from '../../Components/Notifications';
import { useToastContext } from "../../Components/ToastContext.jsx"; // Same folder 
export default function TripHistory() {
  const [search, setSearch] = useState("");
  const [routes, setRoutes] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRouteForReport, setSelectedRouteForReport] = useState(null);
  const { showToast, ToastContainer } = useToast();
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
      //! alert("Test route created! Refreshing...");
      showToast("Test route created! Refreshing...", 'success');
      fetchData();
    } catch (error) {
      console.error("Error creating test route:", error);
      showToast(error.response?.data?.message || "Failed to create test route");
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
  // Around line 60-70, REPLACE the handleGenerateReport function:
  const handleGenerateReport = async (route) => {
  setSelectedRouteForReport(route);
  setModalOpen(true);
  };

  const handleModalSubmit = async (requestData) => {
  setGenerating(selectedRouteForReport._id);
  setModalOpen(false);
  
  try {
    console.log("📊 Generating report with data:", requestData);
    const response = await api.post(`/reports/generate/${selectedRouteForReport._id}`, requestData);
    //! alert("Report generated successfully!");
    showToast("Report generated successfully!", 'success');
    fetchData();
  } catch (error) {
    console.error("Error generating report:", error);
    showToast(error.response?.data?.message || "Failed to generate report");
  } finally {
    setGenerating(null);
    setSelectedRouteForReport(null);
  }
};

  // Download report - Simple redirect through backend
  const handleDownloadReport = async (reportId) => {
    try {
      console.log("📥 Starting download for report:", reportId);
      console.log("🔑 Token exists:", !!localStorage.getItem('accessToken'));
      
      const downloadUrl = `http://localhost:8000/api/v1/reports/download/${reportId}`;
      console.log("🔗 Download URL:", downloadUrl);
      
      const response = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      console.log("📊 Response status:", response.status);
      console.log("📊 Response OK:", response.ok);
      console.log("📊 Content-Type:", response.headers.get('content-type'));

      if (!response.ok) {
        // Try to get error message from response
        const errorText = await response.text();
        console.error("❌ Server error response:", errorText);
        
        let errorMessage = 'Download failed';
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          // Not JSON, use status text
          errorMessage = `Server error: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      const blob = await response.blob();
      
      console.log("📄 Blob type:", blob.type);
      console.log("📄 Blob size:", blob.size);

      if (blob.size === 0) {
        throw new Error('Received empty file');
      }

      // Check if we got HTML error page instead of PDF
      if (blob.type.includes('text/html')) {
        console.error("❌ Received HTML instead of PDF");
        const text = await blob.text();
        console.error("HTML content:", text.substring(0, 500));
        throw new Error('Server returned error page instead of PDF');
      }

      if (blob.type !== 'application/pdf' && !blob.type.includes('octet-stream')) {
        console.warn("⚠️ Unexpected content type:", blob.type);
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log("✅ Download complete");

    } catch (error) {
      console.error("❌ Download error:", error);
      // alert(`Failed to download report: ${error.message}`);
      showToast(`Failed to download report: ${error.message}`, 'error');
    }
  };
  
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading trip history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto p-6 w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <RouteIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Trip History
            </h1>
          </div>
          <p className="text-gray-600 ml-14">View and manage all your planned routes</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-indigo-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by source or destination..."
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50"
              />
            </div>
            <button
              onClick={() => setSearch("")}
              className="bg-gradient-to-r from-gray-100 to-gray-200 px-5 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all font-medium flex items-center gap-2 shadow-sm"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          </div>
          
          {/* Debug buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={createTestRoute}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <TestTube className="w-4 h-4" />
              Create Test Route
            </button>
            <button
              onClick={fetchData}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
            <button
              onClick={() => {
                console.log('Routes:', routes);
                console.log('Reports:', reports);
                console.log('Token:', localStorage.getItem('accessToken'));
              }}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Bug className="w-4 h-4" />
              Debug Info
            </button>
          </div>
        </div>

        {/* Trip Table */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-indigo-100 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <RouteIcon className="w-5 h-5 text-blue-600" />
              Your Trips
            </h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {filteredRoutes.length} {filteredRoutes.length === 1 ? 'Trip' : 'Trips'}
            </span>
          </div>
          
          {filteredRoutes.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RouteIcon className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-gray-500 text-lg mb-2">No trips found</p>
              <p className="text-gray-400 text-sm">Start by planning your first route!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-indigo-200">
                    <th className="p-4 text-left font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-500" />
                        Start
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        Destination
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <RouteIcon className="w-4 h-4 text-blue-500" />
                        Distance
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4 text-amber-500" />
                        Fuel Used
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        Date
                      </div>
                    </th>
                    <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredRoutes.map((route, index) => {
                    const report = getReport(route._id);
                    return (
                      <tr 
                        key={route._id} 
                        className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-medium text-gray-800">{route.source}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-gray-800">{route.destination}</span>
                        </td>
                        <td className="p-4">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {route.distance} km
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {route.fuelRequired ? `${route.fuelRequired} L` : 'N/A'}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">{formatDate(route.createdAt)}</td>
                        <td className="p-4">
                          {report ? (
                            <button
                              onClick={() => handleDownloadReport(report._id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          ) : (
                            <button
                              onClick={() => handleGenerateReport(route)}
                              disabled={generating === route._id}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:cursor-not-allowed"
                            >
                              {generating === route._id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  Generate
                                </>
                              )}
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
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-indigo-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Generated Reports
              </h2>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map((report) => (
                <div 
                  key={report._id} 
                  className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all bg-gradient-to-br from-white to-blue-50/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(report.generatedAt)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-3 text-lg">
                    {report.source} → {report.destination}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                      <span className="text-sm text-gray-600">Distance</span>
                      <span className="font-semibold text-gray-800">{report.distance} km</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                      <span className="text-sm text-gray-600">Fuel Used</span>
                      <span className="font-semibold text-gray-800">{report.fuelUsed} L</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                      <span className="text-sm text-gray-600">Cost</span>
                      <span className="font-bold text-green-600">₹{report.fuelCost}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(report._id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-indigo-700 text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <ToastContainer />
      {/* Add before the closing </div> of main container */}
            <GenerateReportModal
              isOpen={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setSelectedRouteForReport(null);
              }}
              onSubmit={handleModalSubmit}
              route={selectedRouteForReport}
            />
    </div>
  );
}

// // src/pages/TripHistory.jsx
// import React, { useState, useEffect } from "react";
// import api from "../../api/axiosConfig";

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
//   // const handleDownloadReport = async (reportId) => {
//   //   try {
//   //     // // Method 1: Direct download through backend
//   //     // window.open(`http://localhost:8000/api/v1/reports/download/${reportId}`, '_blank');
      
//   //     // Method 2: Force download with fetch (uncomment if needed)
//   //     const response = await fetch(`http://localhost:8000/api/v1/reports/download/${reportId}`, {
//   //       headers: {
//   //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//   //       }
//   //     });
//   //     const blob = await response.blob();
//   //     const url = window.URL.createObjectURL(blob);
//   //     const a = document.createElement('a');
//   //     a.href = url;
//   //     a.download = `report_${reportId}.pdf`;
//   //     document.body.appendChild(a);
//   //     a.click();
//   //     document.body.removeChild(a);
//   //     window.URL.revokeObjectURL(url);
//   //   } catch (error) {
//   //     console.error("Error downloading report:", error);
//   //     alert("Failed to download report");
//   //   }
//   // };

//   // Check if route has a report
  
//   // Download report - Simple redirect through backend
// const handleDownloadReport = async (reportId) => {
//   try {
//     console.log("📥 Starting download for report:", reportId);
//     console.log("🔑 Token exists:", !!localStorage.getItem('accessToken'));
    
//     const downloadUrl = `http://localhost:8000/api/v1/reports/download/${reportId}`;
//     console.log("🔗 Download URL:", downloadUrl);
    
//     const response = await fetch(downloadUrl, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//       }
//     });

//     console.log("📊 Response status:", response.status);
//     console.log("📊 Response OK:", response.ok);
//     console.log("📊 Content-Type:", response.headers.get('content-type'));

//     if (!response.ok) {
//       // Try to get error message from response
//       const errorText = await response.text();
//       console.error("❌ Server error response:", errorText);
      
//       let errorMessage = 'Download failed';
//       try {
//         const errorJson = JSON.parse(errorText);
//         errorMessage = errorJson.message || errorMessage;
//       } catch (e) {
//         // Not JSON, use status text
//         errorMessage = `Server error: ${response.status}`;
//       }
      
//       throw new Error(errorMessage);
//     }

//     const blob = await response.blob();
    
//     console.log("📄 Blob type:", blob.type);
//     console.log("📄 Blob size:", blob.size);

//     if (blob.size === 0) {
//       throw new Error('Received empty file');
//     }

//     // Check if we got HTML error page instead of PDF
//     if (blob.type.includes('text/html')) {
//       console.error("❌ Received HTML instead of PDF");
//       const text = await blob.text();
//       console.error("HTML content:", text.substring(0, 500));
//       throw new Error('Server returned error page instead of PDF');
//     }

//     if (blob.type !== 'application/pdf' && !blob.type.includes('octet-stream')) {
//       console.warn("⚠️ Unexpected content type:", blob.type);
//     }

//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `report_${reportId}.pdf`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
    
//     console.log("✅ Download complete");

//   } catch (error) {
//     console.error("❌ Download error:", error);
//     alert(`Failed to download report: ${error.message}`);
//   }
// };
  
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