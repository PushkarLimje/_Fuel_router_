// src/pages/FuelStations.jsx
import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useToast } from '../../Components/Notifications';
import { useToastContext } from "../../Components/ToastContext.jsx"; // Same folder 
// Custom blue icon for user
const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom red icon for petrol pumps
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterOnUser({ userPos }) {
  const map = useMap();

  useEffect(() => {
    if (userPos) {
      map.setView(userPos, 14);
    }
  }, [userPos, map]);

  return null;
}

export default function FuelStations() {
  const [location, setLocation] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [stations, setStations] = useState([]);
  const [searching, setSearching] = useState(false);
  const { showToast, ToastContainer } = useToast();
  // Get user current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude]);
        },
        () => showToast("Could not get your location", 'error')
      );
    }
  }, []);

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

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location) return;

    setSearching(true);

    try {
      // Search city center first
      const cityRes = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${location}&format=json&limit=1`
      );
      const cityData = await cityRes.json();

      if (cityData.length === 0) {
        showToast("Failed to search stations", 'error');
        setSearching(false);
        return;
      }

      const { lat, lon } = cityData[0];

      // Find petrol pumps in that city (within 5 km)
      const stationsRes = await fetch(
        `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="fuel"](around:5000,${lat},${lon});out;`
      );
      const stationsData = await stationsRes.json();

      // User location for distance
      let userLat = null,
        userLng = null;
      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              userLat = pos.coords.latitude;
              userLng = pos.coords.longitude;
              resolve();
            },
            () => resolve()
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
          time = Math.round((d / 40) * 60) + " mins";
        }

        return {
          id: idx,
          name: el.tags?.name || "Petrol Pump",
          lat: el.lat,
          lng: el.lon,
          fuels: ["Petrol", "Diesel", "CNG"],
          distance,
          time,
        };
      });

      setStations(pumps);
    } catch (error) {
      console.error("Error searching stations:", error);
      alert("Failed to search stations");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Left Panel */}
      <div className="w-96 bg-white shadow-2xl flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Fuel Stations</h1>
          </div>
          <p className="text-blue-100 text-sm">Find nearby fuel stations</p>
        </div>

        {/* Search Form */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter city or area..."
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {searching ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Nearby Stations
            <span className="ml-auto text-sm font-normal text-gray-500">
              {stations.length} found
            </span>
          </h2>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4">
          {stations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-500 font-medium">No stations found</p>
              <p className="text-gray-400 text-sm mt-1">
                Search for a city to find fuel stations
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {stations.map((station) => (
                <li
                  key={station.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {station.name}
                    </h3>
                    <div className="p-1 bg-red-100 rounded-lg">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {station.distance && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="font-medium">{station.distance}</span>
                    </div>
                  )}

                  {station.time && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{station.time}</span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    {station.fuels.map((fuel, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg"
                      >
                        {fuel}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Side Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={userPos || [20.5937, 78.9629]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
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
                {station.distance && (
                  <>
                    📍 {station.distance} <br />
                  </>
                )}
                {station.time && (
                  <>
                    ⏱ {station.time} <br />
                  </>
                )}
                Fuels: {station.fuels.join(", ")}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Info Card */}
        {userPos && (
          <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200 z-[1000]">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">Location Active</span>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
