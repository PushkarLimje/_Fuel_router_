// src/pages/PlanRoute.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import api from "../../api/axiosConfig";

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_KEY;

const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Routing component
function Routing({ startCoords, destCoords, busyness = 0 }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!startCoords || !destCoords) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    let color = "green";
    if (busyness === 1) color = "orange";
    if (busyness === 2) color = "red";

    const control = L.Routing.control({
      waypoints: [
        L.latLng(startCoords[0], startCoords[1]),
        L.latLng(destCoords[0], destCoords[1]),
      ],
      lineOptions: {
        styles: [{ color, weight: 5, opacity: 0.8 }],
      },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    routingControlRef.current = control;

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [startCoords, destCoords, busyness, map]);

  return null;
}

export default function PlanRoute() {
  const [formData, setFormData] = useState({
    start: "",
    destination: "",
    mileage: "",
    fuel: "",
  });

  const [startCoords, setStartCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [center] = useState([20.5937, 78.9629]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch coordinates for a place
  const getCoordinates = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCalculating(true);
    setRouteInfo(null);

    try {
      const start = await getCoordinates(formData.start);
      const dest = await getCoordinates(formData.destination);

      if (!start || !dest) {
        alert("Could not find coordinates for the entered locations");
        setCalculating(false);
        return;
      }

      setStartCoords(start);
      setDestCoords(dest);

      // Fetch route from TomTom
      const url = `https://api.tomtom.com/routing/1/calculateRoute/${start[0]},${start[1]}:${dest[0]},${dest[1]}/json?traffic=true&key=${TOMTOM_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      console.log("TomTom Route Data:", data);
      setRouteData(data);

      // Extract route information
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const summary = route.summary;

        const distanceKm = (summary.lengthInMeters / 1000).toFixed(2);
        const durationMin = Math.round(summary.travelTimeInSeconds / 60);
        const fuelRequired = formData.mileage
          ? (parseFloat(distanceKm) / parseFloat(formData.mileage)).toFixed(2)
          : 0;

        // Save only start and end coordinates (much smaller)
        const pathCoordinates = [
          { lat: start[0], lng: start[1] },
          { lat: dest[0], lng: dest[1] }
        ];

        const routeInformation = {
          source: formData.start,
          destination: formData.destination,
          distance: parseFloat(distanceKm),
          duration: durationMin,
          fuelRequired: parseFloat(fuelRequired),
          pathCoordinates: pathCoordinates,
        };

        setRouteInfo(routeInformation);
        alert("Route calculated successfully!");
      }
    } catch (error) {
      console.error("Error calculating route:", error);
      alert("Failed to calculate route. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  // Save route to database
  const handleSaveRoute = async () => {
    if (!routeInfo) {
      alert("Please plan a route first!");
      return;
    }

    setSaving(true);
    try {
      const response = await api.post("/routes", routeInfo);
      console.log("Route saved:", response.data);
      alert("Route saved successfully to database!");

      // Reset form after saving
      setFormData({
        start: "",
        destination: "",
        mileage: "",
        fuel: "",
      });
      setStartCoords(null);
      setDestCoords(null);
      setRouteInfo(null);
      setRouteData(null);
    } catch (error) {
      console.error("Error saving route:", error);
      alert(error.response?.data?.message || "Failed to save route");
    } finally {
      setSaving(false);
    }
  };

  // Check if user has enough fuel
  const hasEnoughFuel = () => {
    if (!routeInfo || !formData.fuel || !formData.mileage) return true;
    const fuelAvailable = parseFloat(formData.fuel);
    return fuelAvailable >= routeInfo.fuelRequired;
  };

  return (
    <div className="flex h-[90vh] bg-gray-50">
      {/* Left Panel */}
      <div className="w-1/4 bg-white shadow-md p-6 border-r border-gray-200 overflow-y-auto">
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
              step="0.1"
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
              step="0.1"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={calculating}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {calculating ? "Calculating..." : "Plan Route"}
          </button>

          {routeInfo && (
            <button
              type="button"
              onClick={handleSaveRoute}
              disabled={saving}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Route to Database"}
            </button>
          )}
        </form>

        {/* Route Summary */}
        {routeInfo && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-700 mb-3 text-lg">
              Route Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Distance:</span>
                <span className="font-semibold">{routeInfo.distance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">
                  {Math.floor(routeInfo.duration / 60)}h {routeInfo.duration % 60}min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Required:</span>
                <span className="font-semibold">{routeInfo.fuelRequired} L</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fuel Available:</span>
                <span className="font-semibold">{formData.fuel} L</span>
              </div>
            </div>

            {/* Fuel Status */}
            {!hasEnoughFuel() && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                <p className="text-red-700 text-sm font-semibold">
                  ⚠️ Warning: Insufficient fuel!
                </p>
                <p className="text-red-600 text-xs mt-1">
                  You need {(routeInfo.fuelRequired - parseFloat(formData.fuel)).toFixed(2)} L more fuel
                </p>
              </div>
            )}
            {hasEnoughFuel() && formData.fuel && (
              <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-700 text-sm font-semibold">
                  ✅ You have enough fuel for this trip!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1">
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Start Marker */}
          {startCoords && (
            <Marker position={startCoords} icon={markerIcon}>
              <Popup>
                <strong>Start:</strong> {formData.start}
              </Popup>
            </Marker>
          )}

          {/* Destination Marker */}
          {destCoords && (
            <Marker position={destCoords} icon={destinationIcon}>
              <Popup>
                <strong>Destination:</strong> {formData.destination}
              </Popup>
            </Marker>
          )}

          {/* Route Line */}
          {startCoords && destCoords && (
            <Routing
              startCoords={startCoords}
              destCoords={destCoords}
              busyness={0}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}