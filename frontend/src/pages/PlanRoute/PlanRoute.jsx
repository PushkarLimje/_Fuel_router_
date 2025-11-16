// src/pages/PlanRoute.jsx
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import api from "../../api/axiosConfig";
import { MapPin, Navigation, Fuel, Gauge, Clock, Route, Save, AlertTriangle, CheckCircle, Zap, Battery, Car } from "lucide-react";
import { useToast } from '../../Components/Notifications';
import { useToastContext } from "../../Components/ToastContext.jsx"; // Same folder 

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

const fuelStationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const chargingStationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Routing component with waypoints
function Routing({ waypoints, busyness = 0 }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!waypoints || waypoints.length < 2) return;

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    let color = "green";
    if (busyness === 1) color = "orange";
    if (busyness === 2) color = "red";

    const control = L.Routing.control({
      waypoints: waypoints.map(wp => L.latLng(wp[0], wp[1])),
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
  }, [waypoints, busyness, map]);

  return null;
}

export default function PlanRoute() {
  const [vehicleType, setVehicleType] = useState("petrol"); // petrol or ev
  const [formData, setFormData] = useState({
    start: "",
    destination: "",
    mileage: "",
    fuel: "",
    batteryCapacity: "",
    currentCharge: "",
    rangePerKwh: "",
  });

  const [startCoords, setStartCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [center] = useState([20.5937, 78.9629]);
  //const { showToast, ToastContainer } = useToast();
  const { showToast } = useToastContext();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVehicleTypeChange = (type) => {
    setVehicleType(type);
    // Reset form data when switching vehicle type
    setFormData({
      start: formData.start,
      destination: formData.destination,
      mileage: "",
      fuel: "",
      batteryCapacity: "",
      currentCharge: "",
      rangePerKwh: "",
    });
    setRouteOptions([]);
    setSelectedRoute(null);
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

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Find nearby fuel stations
  const findNearbyFuelStations = async (startLat, startLon, destLat, destLon) => {
    try {
      const midLat = (startLat + destLat) / 2;
      const midLon = (startLon + destLon) / 2;
      
      const query = `fuel station near ${midLat},${midLon}`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=10`
      );
      const stations = await res.json();
      
      const routeDistance = calculateDistance(startLat, startLon, destLat, destLon);
      const validStations = stations.filter(station => {
        const stationLat = parseFloat(station.lat);
        const stationLon = parseFloat(station.lon);
        
        const toStationDist = calculateDistance(startLat, startLon, stationLat, stationLon);
        const fromStationDist = calculateDistance(stationLat, stationLon, destLat, destLon);
        const totalWithStation = toStationDist + fromStationDist;
        
        return totalWithStation <= routeDistance * 1.2;
      });

      return validStations.slice(0, 5);
    } catch (error) {
      console.error("Error finding fuel stations:", error);
      return [];
    }
  };

  // Find nearby EV charging stations using Overpass API
  // Find nearby EV charging stations using TomTom Search API
  const findNearbyChargingStations = async (startLat, startLon, destLat, destLon) => {
    try {
      const midLat = (startLat + destLat) / 2;
      const midLon = (startLon + destLon) / 2;
      
      // Calculate search radius in km (60% of route distance, max 50km)
      const routeDistance = calculateDistance(startLat, startLon, destLat, destLon);
      const searchRadius = Math.min(Math.ceil(routeDistance * 0.6), 50);
      
      // Use TomTom Search API for EV charging stations
      const url = `https://api.tomtom.com/search/2/categorySearch/electric%20vehicle%20station.json?lat=${midLat}&lon=${midLon}&radius=${searchRadius * 1000}&limit=20&key=${TOMTOM_API_KEY}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.results || data.results.length === 0) {
        console.log("No charging stations found via TomTom, trying backup search...");
        return await findChargingStationsFallback(startLat, startLon, destLat, destLon);
      }
      
      // Convert TomTom format to our format
      const stations = data.results.map(result => ({
        lat: result.position.lat.toString(),
        lon: result.position.lon.toString(),
        display_name: result.poi?.name || 'EV Charging Station',
        place_id: result.id
      }));
      
      // Filter stations that are reasonably on the route
      const validStations = stations.filter(station => {
        const stationLat = parseFloat(station.lat);
        const stationLon = parseFloat(station.lon);
        
        const toStationDist = calculateDistance(startLat, startLon, stationLat, stationLon);
        const fromStationDist = calculateDistance(stationLat, stationLon, destLat, destLon);
        const totalWithStation = toStationDist + fromStationDist;
        
        return totalWithStation <= routeDistance * 1.3;
      });

      console.log(`Found ${validStations.length} charging stations via TomTom API`);
      return validStations.slice(0, 8);
    } catch (error) {
      console.error("Error finding charging stations via TomTom:", error);
      // Fallback to Nominatim search
      return await findChargingStationsFallback(startLat, startLon, destLat, destLon);
    }
  };

  // const findNearbyChargingStations = async (startLat, startLon, destLat, destLon) => {
  //   try {
  //     const midLat = (startLat + destLat) / 2;
  //     const midLon = (startLon + destLon) / 2;
      
  //     // Calculate search radius in meters (20% of route distance)
  //     const routeDistance = calculateDistance(startLat, startLon, destLat, destLon);
  //     const searchRadius = Math.min(routeDistance * 1000 * 0.6, 50000); // Max 50km radius
      
  //     // Use Overpass API to find charging stations with amenity=charging_station tag
  //     const overpassQuery = `
  //       [out:json][timeout:25];
  //       (
  //         node["amenity"="charging_station"](around:${searchRadius},${midLat},${midLon});
  //         way["amenity"="charging_station"](around:${searchRadius},${midLat},${midLon});
  //       );
  //       out center;
  //     `;
      
  //     const overpassUrl = 'https://overpass-api.de/api/interpreter';
  //     const res = await fetch(overpassUrl, {
  //       method: 'POST',
  //       body: overpassQuery
  //     });
      
  //     const data = await res.json();
      
  //     if (!data.elements || data.elements.length === 0) {
  //       console.log("No charging stations found, trying backup search...");
  //       // Fallback to Nominatim if Overpass fails
  //       return await findChargingStationsFallback(startLat, startLon, destLat, destLon);
  //     }
      
  //     // Convert Overpass format to our format
  //     const stations = data.elements.map(element => {
  //       const lat = element.lat || element.center?.lat;
  //       const lon = element.lon || element.center?.lon;
  //       const name = element.tags?.name || element.tags?.operator || 'EV Charging Station';
        
  //       return {
  //         lat: lat.toString(),
  //         lon: lon.toString(),
  //         display_name: name,
  //         place_id: element.id
  //       };
  //     });
      
  //     // Filter stations that are reasonably on the route
  //     const validStations = stations.filter(station => {
  //       const stationLat = parseFloat(station.lat);
  //       const stationLon = parseFloat(station.lon);
        
  //       const toStationDist = calculateDistance(startLat, startLon, stationLat, stationLon);
  //       const fromStationDist = calculateDistance(stationLat, stationLon, destLat, destLon);
  //       const totalWithStation = toStationDist + fromStationDist;
        
  //       return totalWithStation <= routeDistance * 1.3;
  //     });

  //     console.log(`Found ${validStations.length} charging stations via Overpass API`);
  //     return validStations.slice(0, 8);
  //   } catch (error) {
  //     console.error("Error finding charging stations:", error);
  //     // Fallback to Nominatim search
  //     return await findChargingStationsFallback(startLat, startLon, destLat, destLon);
  //   }
  // };

  // Fallback method using Nominatim
  const findChargingStationsFallback = async (startLat, startLon, destLat, destLon) => {
    try {
      const midLat = (startLat + destLat) / 2;
      const midLon = (startLon + destLon) / 2;
      
      const queries = [
        `EV charging station near ${midLat},${midLon}`,
        `electric vehicle charging near ${midLat},${midLon}`,
      ];
      
      let allStations = [];
      
      for (const query of queries) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
        );
        const stations = await res.json();
        allStations = [...allStations, ...stations];
      }
      
      const uniqueStations = allStations.filter((station, index, self) =>
        index === self.findIndex(s => s.place_id === station.place_id)
      );
      
      console.log(`Found ${uniqueStations.length} charging stations via Nominatim fallback`);
      return uniqueStations.slice(0, 5);
    } catch (error) {
      console.error("Fallback search also failed:", error);
      return [];
    }
  };

  // Calculate route with TomTom
  const calculateRoute = async (waypoints) => {
    const waypointsStr = waypoints.map(wp => `${wp[0]},${wp[1]}`).join(':');
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${waypointsStr}/json?traffic=true&key=${TOMTOM_API_KEY}`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const summary = route.summary;
      return {
        distance: summary.lengthInMeters / 1000,
        duration: Math.round(summary.travelTimeInSeconds / 60),
      };
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCalculating(true);
    setRouteOptions([]);
    setSelectedRoute(null);

    try {
      const start = await getCoordinates(formData.start);
      const dest = await getCoordinates(formData.destination);

      if (!start || !dest) {
        showToast("Could not find coordinates for the entered locations", 'error');
        setCalculating(false);
        return;
      }

      setStartCoords(start);
      setDestCoords(dest);

      const routes = [];

      // Route 1: Direct route
      const directRoute = await calculateRoute([start, dest]);
      if (directRoute) {
        let energyRequired, energyUnit;
        
        if (vehicleType === "petrol") {
          energyRequired = formData.mileage
            ? (directRoute.distance / parseFloat(formData.mileage)).toFixed(2)
            : 0;
          energyUnit = "L";
        } else {
          // EV calculation: distance / range per kWh
          energyRequired = formData.rangePerKwh
            ? (directRoute.distance / parseFloat(formData.rangePerKwh)).toFixed(2)
            : 0;
          energyUnit = "kWh";
        }

        routes.push({
          id: 'direct',
          type: 'Direct Route',
          waypoints: [start, dest],
          distance: directRoute.distance.toFixed(2),
          duration: directRoute.duration,
          energyRequired: parseFloat(energyRequired),
          energyUnit: energyUnit,
          chargingStation: null,
          pathCoordinates: [
            { lat: start[0], lng: start[1] },
            { lat: dest[0], lng: dest[1] }
          ]
        });
      }

      // Check if refill/recharge is needed
      let needsStop = false;
      let availableEnergy, directEnergyRequired;
      
      if (vehicleType === "petrol") {
        availableEnergy = parseFloat(formData.fuel);
        directEnergyRequired = directRoute ? (directRoute.distance / parseFloat(formData.mileage)) : 0;
      } else {
        availableEnergy = parseFloat(formData.currentCharge);
        directEnergyRequired = directRoute ? (directRoute.distance / parseFloat(formData.rangePerKwh)) : 0;
      }
      
      needsStop = availableEnergy < directEnergyRequired;
      
      if (needsStop) {
        // Find appropriate stations based on vehicle type
        const stations = vehicleType === "petrol" 
          ? await findNearbyFuelStations(start[0], start[1], dest[0], dest[1])
          : await findNearbyChargingStations(start[0], start[1], dest[0], dest[1]);
        
        // Calculate routes via each station
        for (const station of stations) {
          const stationCoords = [parseFloat(station.lat), parseFloat(station.lon)];
          const routeViaStation = await calculateRoute([start, stationCoords, dest]);
          
          if (routeViaStation) {
            let energyRequired, energyUnit;
            
            if (vehicleType === "petrol") {
              energyRequired = formData.mileage
                ? (routeViaStation.distance / parseFloat(formData.mileage)).toFixed(2)
                : 0;
              energyUnit = "L";
            } else {
              energyRequired = formData.rangePerKwh
                ? (routeViaStation.distance / parseFloat(formData.rangePerKwh)).toFixed(2)
                : 0;
              energyUnit = "kWh";
            }

            routes.push({
              id: `station-${station.place_id}`,
              type: vehicleType === "petrol" ? 'Via Fuel Station' : 'Via Charging Station',
              waypoints: [start, stationCoords, dest],
              distance: routeViaStation.distance.toFixed(2),
              duration: routeViaStation.duration,
              energyRequired: parseFloat(energyRequired),
              energyUnit: energyUnit,
              chargingStation: {
                name: station.display_name.split(',')[0],
                coords: stationCoords,
                type: vehicleType === "petrol" ? 'fuel' : 'charging'
              },
              pathCoordinates: [
                { lat: start[0], lng: start[1] },
                { lat: stationCoords[0], lng: stationCoords[1] },
                { lat: dest[0], lng: dest[1] }
              ]
            });
          }
        }
      }

      // Sort routes by distance (minimum distance first)
      routes.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      
      setRouteOptions(routes);
      
      // Auto-select the best route (minimum distance)
      if (routes.length > 0) {
        setSelectedRoute(routes[0]);
      }

      showToast(`Found ${routes.length} route option(s)! Select your preferred route.`, 'success');
    } catch (error) {
      console.error("Error calculating route:", error);
      showToast("Failed to calculate route. Please try again.", 'error');
    } finally {
      setCalculating(false);
    }
  };

  // Save route to database
  const handleSaveRoute = async () => {
    if (!selectedRoute) {
      showToast("Please select a route first!", 'warning');
      return;
    }

    setSaving(true);
    try {
      const routeData = {
        source: formData.start,
        destination: formData.destination,
        distance: parseFloat(selectedRoute.distance),
        duration: selectedRoute.duration,
        fuelRequired: selectedRoute.energyRequired,
        pathCoordinates: selectedRoute.pathCoordinates,
        routeType: selectedRoute.type,
        vehicleType: vehicleType,
        energyUnit: selectedRoute.energyUnit,
        fuelStation: selectedRoute.chargingStation ? selectedRoute.chargingStation.name : null
      };

      const response = await api.post("/routes", routeData);
      console.log("Route saved:", response.data);
      showToast("Route saved successfully to database!", 'success');

      // Reset form after saving
      setFormData({
        start: "",
        destination: "",
        mileage: "",
        fuel: "",
        batteryCapacity: "",
        currentCharge: "",
        rangePerKwh: "",
      });
      setStartCoords(null);
      setDestCoords(null);
      setRouteOptions([]);
      setSelectedRoute(null);
    } catch (error) {
      console.error("Error saving route:", error);
      showToast(error.response?.data?.message || "Failed to save route", 'error');
    } finally {
      setSaving(false);
    }
  };

  // Check if user has enough energy (fuel or battery)
  const hasEnoughEnergy = () => {
    if (!selectedRoute) return true;
    
    if (vehicleType === "petrol") {
      if (!formData.fuel || !formData.mileage) return true;
      const fuelAvailable = parseFloat(formData.fuel);
      return fuelAvailable >= selectedRoute.energyRequired;
    } else {
      if (!formData.currentCharge || !formData.rangePerKwh) return true;
      const chargeAvailable = parseFloat(formData.currentCharge);
      return chargeAvailable >= selectedRoute.energyRequired;
    }
  };

  return (
    <div className="flex h-[90vh] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Left Panel */}
      <div className="w-1/4 bg-white/80 backdrop-blur-sm shadow-2xl p-6 border-r border-indigo-100 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Plan Your Journey
            </h2>
          </div>
          <p className="text-gray-500 text-sm ml-14">Enter your trip details below</p>
        </div>

        {/* Vehicle Type Selection */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-3 font-medium">Vehicle Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleVehicleTypeChange("petrol")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                vehicleType === "petrol"
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <Fuel className={`w-6 h-6 ${vehicleType === "petrol" ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`font-semibold text-sm ${vehicleType === "petrol" ? 'text-blue-700' : 'text-gray-600'}`}>
                Petrol/Diesel
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleVehicleTypeChange("ev")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                vehicleType === "ev"
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}
            >
              <Zap className={`w-6 h-6 ${vehicleType === "ev" ? 'text-green-600' : 'text-gray-400'}`} />
              <span className={`font-semibold text-sm ${vehicleType === "ev" ? 'text-green-700' : 'text-gray-600'}`}>
                Electric (EV)
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="group">
            <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
              <MapPin className="w-4 h-4 text-green-500" />
              Start Location
            </label>
            <input
              type="text"
              name="start"
              value={formData.start}
              onChange={handleChange}
              placeholder="Enter starting point"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
              required
            />
          </div>

          <div className="group">
            <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
              <MapPin className="w-4 h-4 text-red-500" />
              Destination
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination"
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
              required
            />
          </div>

          {vehicleType === "petrol" ? (
            <>
              <div className="group">
                <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                  <Gauge className="w-4 h-4 text-blue-500" />
                  Car Mileage (km/l)
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  step="0.1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                  required
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                  <Fuel className="w-4 h-4 text-amber-500" />
                  Fuel Available (litres)
                </label>
                <input
                  type="number"
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  step="0.1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="group">
                <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                  <Battery className="w-4 h-4 text-green-500" />
                  Battery Capacity (kWh)
                </label>
                <input
                  type="number"
                  name="batteryCapacity"
                  value={formData.batteryCapacity}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  step="0.1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                  required
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Current Charge (kWh)
                </label>
                <input
                  type="number"
                  name="currentCharge"
                  value={formData.currentCharge}
                  onChange={handleChange}
                  placeholder="e.g. 40"
                  step="0.1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                  required
                />
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                  <Gauge className="w-4 h-4 text-blue-500" />
                  Range per kWh (km/kWh)
                </label>
                <input
                  type="number"
                  name="rangePerKwh"
                  value={formData.rangePerKwh}
                  onChange={handleChange}
                  placeholder="e.g. 6"
                  step="0.1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white/50"
                  required
                />
              </div>
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={calculating}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Route className="w-5 h-5" />
            {calculating ? "Calculating..." : "Plan Route"}
          </button>

          {selectedRoute && (
            <button
              onClick={handleSaveRoute}
              disabled={saving}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Route"}
            </button>
          )}
        </div>

        {/* Route Options */}
        {routeOptions.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-indigo-700 mb-3 text-lg flex items-center gap-2">
              <Car className="w-5 h-5" />
              Route Options ({routeOptions.length})
            </h3>
            <div className="space-y-3">
              {routeOptions.map((route, index) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedRoute?.id === route.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${
                      selectedRoute?.id === route.id ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                      {route.type}
                    </span>
                    {index === 0 && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                        Shortest
                      </span>
                    )}
                  </div>
                  
                  {route.chargingStation && (
                    <div className="flex items-center gap-2 text-sm mb-2">
                      {route.chargingStation.type === 'fuel' ? (
                        <Fuel className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Zap className="w-4 h-4 text-green-600" />
                      )}
                      <span className={`font-medium ${
                        route.chargingStation.type === 'fuel' ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {route.chargingStation.name}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-semibold">{route.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">
                        {Math.floor(route.duration / 60)}h {route.duration % 60}m
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {vehicleType === "petrol" ? "Fuel:" : "Energy:"}
                      </span>
                      <span className="font-semibold">
                        {route.energyRequired} {route.energyUnit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Route Summary */}
        {selectedRoute && (
          <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-lg">
            <h3 className="font-bold text-indigo-700 mb-4 text-lg flex items-center gap-2">
              <Route className="w-5 h-5" />
              Selected Route
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                <span className="text-gray-600 flex items-center gap-2">
                  <Route className="w-4 h-4 text-blue-500" />
                  Distance
                </span>
                <span className="font-bold text-gray-800">{selectedRoute.distance} km</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                <span className="text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  Duration
                </span>
                <span className="font-bold text-gray-800">
                  {Math.floor(selectedRoute.duration / 60)}h {selectedRoute.duration % 60}m
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                <span className="text-gray-600 flex items-center gap-2">
                  {vehicleType === "petrol" ? (
                    <Fuel className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Battery className="w-4 h-4 text-green-500" />
                  )}
                  {vehicleType === "petrol" ? "Fuel Required" : "Energy Required"}
                </span>
                <span className="font-bold text-gray-800">
                  {selectedRoute.energyRequired} {selectedRoute.energyUnit}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                <span className="text-gray-600 flex items-center gap-2">
                  {vehicleType === "petrol" ? (
                    <Fuel className="w-4 h-4 text-green-500" />
                  ) : (
                    <Zap className="w-4 h-4 text-yellow-500" />
                  )}
                  {vehicleType === "petrol" ? "Fuel Available" : "Charge Available"}
                </span>
                <span className="font-bold text-gray-800">
                  {vehicleType === "petrol" ? formData.fuel : formData.currentCharge} {selectedRoute.energyUnit}
                </span>
              </div>
            </div>

            {/* Energy Status */}
            {!hasEnoughEnergy() && (
              <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl shadow-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-bold">
                      {vehicleType === "petrol" ? "Insufficient Fuel!" : "Insufficient Charge!"}
                    </p>
                    <p className="text-red-600 text-sm mt-1">
                      You need{" "}
                      {(selectedRoute.energyRequired - parseFloat(
                        vehicleType === "petrol" ? formData.fuel : formData.currentCharge
                      )).toFixed(2)}{" "}
                      {selectedRoute.energyUnit} more
                    </p>
                  </div>
                </div>
              </div>
            )}
            {hasEnoughEnergy() && (vehicleType === "petrol" ? formData.fuel : formData.currentCharge) && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-md">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 font-bold">
                    Perfect! You have enough {vehicleType === "petrol" ? "fuel" : "charge"} for this trip
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            {vehicleType === "petrol" ? (
              <Fuel className="w-4 h-4 text-amber-500" />
            ) : (
              <Zap className="w-4 h-4 text-green-500" />
            )}
            {vehicleType === "petrol" ? "Petrol/Diesel" : "Electric Vehicle"} Route Map
          </p>
        </div>
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

          {/* Fuel/Charging Station Marker */}
          {selectedRoute && selectedRoute.chargingStation && (
            <Marker 
              position={selectedRoute.chargingStation.coords} 
              icon={selectedRoute.chargingStation.type === 'fuel' ? fuelStationIcon : chargingStationIcon}
            >
              <Popup>
                <strong>
                  {selectedRoute.chargingStation.type === 'fuel' ? 'Fuel Station' : 'Charging Station'}:
                </strong>{" "}
                {selectedRoute.chargingStation.name}
              </Popup>
            </Marker>
          )}

          {/* Route Line */}
          {selectedRoute && (
            <Routing
              waypoints={selectedRoute.waypoints}
              busyness={0}
            />
          )}
        </MapContainer>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
}












