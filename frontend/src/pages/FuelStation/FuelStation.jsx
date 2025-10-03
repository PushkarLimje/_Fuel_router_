// src/pages/FuelStations.jsx
import React, { useState,useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Custom blue icon for user
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom red icon for petrol pumps
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

  function RecenterOnUser({ userPos }) {
  const map = useMap();

  useEffect(() => {
    if (userPos) {
      map.setView(userPos, 14); // 14 is zoom level, you can change
    }
  }, [userPos, map]);

  return null;
  }


export default function FuelStations() {
  const [location, setLocation] = useState("");
  
  const [userPos, setUserPos] = useState(null);
  const [stations, setStations] = useState([]);
 
  // Get user current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
        },
        () => alert("Could not get your location")
      );
    }
  }, []);

  // Handle search
  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   if (!location) return;

  //   // Search city center first
  //   const cityRes = await fetch(
  //     `https://nominatim.openstreetmap.org/search?city=${location}&format=json&limit=1`
  //   );
  //   const cityData = await cityRes.json();

  //   if (cityData.length === 0) {
  //     alert("City not found");
  //     return;
  //   }

  //   const { lat, lon } = cityData[0];

  //   // Find petrol pumps in that city
  //   const stationsRes = await fetch(
  //     `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="fuel"](around:5000,${lat},${lon});out;`
  //   );
  //   const stationsData = await stationsRes.json();

  //   const pumps = stationsData.elements.map((el, idx) => ({
  //     id: idx,
  //     name: el.tags.name || "Petrol Pump",
  //     lat: el.lat,
  //     lng: el.lon,
  //   }));

  //   setStations(pumps);
  // };

  const handleSearch = async (e) => {
  e.preventDefault();
  if (!location) return;

  // Search city center first
  const cityRes = await fetch(
    `https://nominatim.openstreetmap.org/search?city=${location}&format=json&limit=1`
  );
  const cityData = await cityRes.json();

  if (cityData.length === 0) {
    alert("City not found");
    return;
  }

  const { lat, lon } = cityData[0];

  // Find petrol pumps in that city (within 5 km)
  const stationsRes = await fetch(
    `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="fuel"](around:5000,${lat},${lon});out;`
  );
  const stationsData = await stationsRes.json();

  // Haversine distance helper
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // User location for distance
  let userLat = null, userLng = null;
  if (navigator.geolocation) {
    await new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLat = pos.coords.latitude;
          userLng = pos.coords.longitude;
          resolve();
        },
        () => resolve() // fallback: no user location
      );
    });
  }

  // Map station data with extra info
  const pumps = stationsData.elements.map((el, idx) => {
    let distance = null;
    let time = null;

    if (userLat && userLng) {
      const d = getDistance(userLat, userLng, el.lat, el.lon);
      distance = d.toFixed(2) + " km";
      time = Math.round((d / 40) * 60) + " mins";   // assume 40km/h
    }

    return {
      id: idx,
      name: el.tags?.name || "Petrol Pump",
      lat: el.lat,
      lng: el.lon,
      fuels: ["Petrol", "Diesel", "CNG"], // mock fuel types
      distance,
      time,
    };
  });

  setStations(pumps);
};


  // return (
  //   <div className="min-h-screen bg-gray-50 flex flex-col">

  //     {/* Main Section */}
  //     <main className="flex-1 max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
  //       {/* Left - Search & List */}
  //       <div className="md:col-span-1">
  //         {/* Search Form */}
  //         <form
  //           onSubmit={handleSearch}
  //           className="bg-white p-6 rounded-2xl shadow-md mb-6"
  //         >
  //           <h2 className="text-lg font-semibold mb-4">Search Stations</h2>
  //           <input
  //             type="text"
  //             value={location}
  //             onChange={(e) => setLocation(e.target.value)}
  //             className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
  //             placeholder="Enter city or area"
  //             required
  //           />
  //           <button
  //             type="submit"
  //             className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
  //           >
  //             Search
  //           </button>
  //         </form>

  //         {/* Stations List */}
  //         {/* <div className="bg-white p-6 rounded-2xl shadow-md">
  //           <h2 className="text-lg font-semibold mb-4">Nearby Stations</h2>
  //           <ul className="space-y-4">
  //             {stations.map((station) => (
  //               <li
  //                 key={station.id}
  //                 className="p-4 border rounded-lg hover:bg-gray-50 transition"
  //               >
  //                 <h3 className="font-bold text-gray-800">{station.name}</h3>
  //                 <p className="text-sm text-gray-600">Distance: {station.distance}</p>
  //                 <p className="text-sm text-gray-600">Price: {station.price}</p>
  //               </li>
  //             ))}
  //           </ul>
  //         </div> */}

  //         {/* Stations List */}
  //           <div className="bg-white p-6 rounded-2xl shadow-md">
  //             <h2 className="text-lg font-semibold mb-4">Nearby Stations</h2>
  //             <ul className="space-y-4">
  //               {stations.map((station) => (
  //                 <li
  //                   key={station.id}
  //                   className="p-4 border rounded-lg hover:bg-gray-50 transition"
  //                 >
  //                   <h3 className="font-bold text-gray-800">{station.name}</h3>
  //                   {station.distance && (
  //                     <p className="text-sm text-gray-600">Distance: {station.distance}</p>
  //                   )}
  //                   {station.time && (
  //                     <p className="text-sm text-gray-600">Travel Time: {station.time}</p>
  //                   )}
  //                   <p className="text-sm text-gray-600">
  //                     Fuels: {station.fuels.join(", ")}
  //                   </p>
  //                 </li>
  //               ))}
  //             </ul>
  //           </div>

  //       </div>

  //       {/* Right - Map */}
  //       <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-md flex flex-col">
  //         <h2 className="text-lg font-semibold mb-4">Map</h2>
  //         <div className="flex-1 rounded-lg overflow-hidden">
  //           <MapContainer
  //             center={userPos || [20.5937, 78.9629]} // India center fallback
  //             zoom={12}
  //             style={{ height: "500px", width: "100%" }}
  //           >
  //             <TileLayer
  //               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  //               attribution="&copy; OpenStreetMap contributors"
  //             />

  //             {/* User Location */}
  //             {userPos && (
  //               <Marker position={userPos} icon={blueIcon}>
  //                 <Popup>📍 You are here</Popup>
  //               </Marker>
  //             )}

  //             {/* Petrol Stations */}
  //             {stations.map((station) => (
  //               <Marker
  //                 key={station.id}
  //                 position={[station.lat, station.lng]}
  //                 icon={redIcon}
  //               >
  //                 {/* <Popup>⛽ {station.name}</Popup> */}
  //                 <Popup>
  //                   <b>{station.name}</b> <br />
  //                   {station.distance && <>📍 {station.distance} <br /></>}
  //                   {station.time && <>⏱ {station.time} <br /></>}
  //                   Fuels: {station.fuels.join(", ")}
  //                 </Popup>

  //               </Marker>
  //             ))}
  //           </MapContainer>
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // );
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel */}
      <div className="w-80 bg-white shadow-lg p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-6 text-blue-600">Fuel Stations</h1>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter city or area"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* Results */}
        <h2 className="text-lg font-semibold mb-3">Nearby Stations</h2>
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-3">
            {stations.map((station) => (
              <li
                key={station.id}
                className="p-3 border rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-bold text-gray-800">{station.name}</h3>
                {station.distance && (
                  <p className="text-sm text-gray-600">📍 {station.distance}</p>
                )}
                {station.time && (
                  <p className="text-sm text-gray-600">⏱ {station.time}</p>
                )}
                <p className="text-sm text-gray-600">
                  Fuels: {station.fuels.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side Map */}
      <div className="flex-1">
        <MapContainer
          center={userPos || [20.5937, 78.9629]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* Center map on user position */}
              <RecenterOnUser userPos={userPos} />
          {userPos && (
            <Marker position={userPos} icon={blueIcon}>
              <Popup>📍 You are here</Popup>
            </Marker>
          )}
          {stations.map((station) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={redIcon}
            >
              <Popup>
                <b>{station.name}</b> <br />
                {station.distance && <>📍 {station.distance} <br /></>}
                {station.time && <>⏱ {station.time} <br /></>}
                Fuels: {station.fuels.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}