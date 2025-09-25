// src/pages/PlanRoute.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// Fix Leaflet's default icon issue with React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function PlanRoute() {
  const [formData, setFormData] = useState({
    start: "",
    destination: "",
    mileage: "",
    fuel: "",
  });

  const [center] = useState([20.5937, 78.9629]);    // India default

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (formData.start) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${formData.start}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    }

    // later: send this to backend / API
    console.log("Form Data:", formData);
    alert("Route planned! (Mockup)");
  };

  return (

    // <div className="min-h-screen bg-gray-50 flex flex-col">
    //   {/* Header */}
    //   {/* <header className="bg-white shadow-md">
    //     <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
    //       <h1 className="text-2xl font-bold text-blue-600">Plan Route</h1>
    //       <nav className="space-x-6">
    //         <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
    //         <a href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</a>
    //         <a href="/stations" className="text-gray-700 hover:text-blue-600">Fuel Stations</a>
    //       </nav>
    //     </div>
    //   </header> */}
    //   {/* Main Section */}
    //   <main className="flex-1 max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
    //     {/* Route Form */}
    //     <form
    //       onSubmit={handleSubmit}
    //       className="bg-white p-6 rounded-2xl shadow-md space-y-4"
    //     >
    //       <h2 className="text-xl font-semibold mb-4">Enter Trip Details</h2>
    //       <div>
    //         <label className="block text-gray-600 mb-1">Start Location</label>
    //         <input
    //           type="text"
    //           name="start"
    //           value={formData.start}
    //           onChange={handleChange}
    //           className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    //           placeholder="Enter starting point"
    //           required
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-gray-600 mb-1">Destination</label>
    //         <input
    //           type="text"
    //           name="destination"
    //           value={formData.destination}
    //           onChange={handleChange}
    //           className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    //           placeholder="Enter destination"
    //           required
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-gray-600 mb-1">Car Mileage (km/l)</label>
    //         <input
    //           type="number"
    //           name="mileage"
    //           value={formData.mileage}
    //           onChange={handleChange}
    //           className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    //           placeholder="e.g. 15"
    //           required
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-gray-600 mb-1">Fuel Available (litres)</label>
    //         <input
    //           type="number"
    //           name="fuel"
    //           value={formData.fuel}
    //           onChange={handleChange}
    //           className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    //           placeholder="e.g. 10"
    //           required
    //         />
    //       </div>
    //       <button
    //         type="submit"
    //         className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    //       >
    //         Plan Route
    //       </button>
    //     </form>
    //     {/* Route Preview / Map
    //     <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center justify-center">
    //       <h2 className="text-xl font-semibold mb-4">Route Preview</h2>
    //       <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
    //         Map will be displayed here
    //       </div>
    //     </div> */}
    //       {/* Right side: Map */}
    //     <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col">
    //       <h2 className="text-xl font-semibold mb-4">Map Preview</h2>
    //       <MapContainer
    //         center={[20.5937, 78.9629]} // Default: India center
    //         zoom={5}
    //         className="w-full h-96 rounded-lg"
    //       >
    //         <TileLayer
    //           attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //         />
    //         <Marker position={[20.5937, 78.9629]}>
    //           <Popup>Default Location (India)</Popup>
    //         </Marker>
    //       </MapContainer>
    //     </div>
    //   </main>
    // </div>

     <div className="flex h-[90vh] bg-gray-50">
      {/* Left Panel */}
      <div className="w-1/4 bg-white shadow-md p-6 border-r border-gray-200">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Enter Trip Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Start Location</label>
            <input
              type="text"
              name="start"
              value={formData.start}
              onChange={handleChange}
              placeholder="Enter starting point"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Car Mileage (km/l)
            </label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              placeholder="e.g. 15"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Fuel Available (litres)
            </label>
            <input
              type="number"
              name="fuel"
              value={formData.fuel}
              onChange={handleChange}
              placeholder="e.g. 10"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Plan Route
          </button>
        </form>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1">
        <MapContainer
          center={center}
          zoom={5}
          className="h-full w-full rounded-r-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={center} icon={markerIcon} />
        </MapContainer>
      </div>
    </div>
  );
}
