// src/pages/PlanRoute.jsx
import React, { useState,  useEffect,  useRef} from "react";
import { MapContainer, TileLayer, Marker, Popup,  useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

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

// Helper to recenter map
function RecenterMap({ bounds }) {
  const map = useMap();
  if (bounds) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  return null;
}
// Example: your traffic API fetch function
async function fetchTrafficForSegment(lat1, lon1, lat2, lon2) {
  // Example: call HERE or TomTom or your chosen API
  // Return a number between 0 and 1 (1 => free, 0.5 => moderate, 0.2 => heavy)
  // This is pseudocode:
  
  const resp = await fetch(
    `https://trafficapi.example.com/flow?start=${lat1},${lon1}&end=${lat2},${lon2}&apiKey=YOUR_KEY`
  );
  const data = await resp.json();
  return data.flowRatio;
  
  return 1; // dummy = free traffic
}


function Routing({ startCoords, destCoords, busyness = 0  }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!startCoords || !destCoords) return;

    // Remove old route if exists
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

     // Pick color based on busyness
    let color = "green";
    if (busyness === 1) color = "orange";
    if (busyness === 2) color = "red";

    // Create new routing control
    const control = L.Routing.control({
      waypoints: [
        L.latLng(startCoords[0], startCoords[1]),
        L.latLng(destCoords[0], destCoords[1]),
      ],
      lineOptions: {
        styles: [{ color, weight: 5, opacity: 0.8 }],
      },
      createMarker: () => null, // disable extra markers
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    routingControlRef.current = control;

    // Cleanup on unmount
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [startCoords, destCoords,busyness, map]);

  return null;
}


// function Routing({ startCoords, destCoords }) {
//   const map = useMap();
//   const routingControlRef = useRef(null);

//   useEffect(() => {
//     if (!startCoords || !destCoords) return;

//      // Remove old route if exists
//     if (routingControlRef.current) {
//       map.removeControl(routingControlRef.current);
//     }

  
//     L.Routing.control({
//       waypoints: [
//         L.latLng(startCoords[0], startCoords[1]),
//         L.latLng(destCoords[0], destCoords[1]),
//       ],
//       lineOptions: {
//         styles: [{ color: "blue", weight: 4 }],
//       },
//       createMarker: () => null, // prevent default markers
//       addWaypoints: false,
//       draggableWaypoints: false,
//       fitSelectedRoutes: true,
//     }).addTo(map);

//   }, [startCoords, destCoords, map]);

//   return null;
// }



export default function PlanRoute() {
  const [formData, setFormData] = useState({
    start: "",
    destination: "",
    mileage: "",
    fuel: "",
  });

  const [startCoords, setStartCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [center] = useState([20.5937, 78.9629]);    // India default

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

    const start = await getCoordinates(formData.start);
    const dest = await getCoordinates(formData.destination);

    if (start) setStartCoords(start);
    if (dest) setDestCoords(dest);

    if (start && dest) {
      setBounds([start, dest]); // fit map to both points
    }

    console.log("Trip Data:", formData);
    alert("Route planned! (Mockup)");
  };

  // const handleSubmit = async(e) => {
  //   e.preventDefault();

  //   if (formData.start) {
  //     const res = await fetch(
  //       `https://nominatim.openstreetmap.org/search?format=json&q=${formData.start}`
  //     );
  //     const data = await res.json();
  //     if (data.length > 0) {
  //       setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
  //     }
  //   }

  //   // later: send this to backend / API
  //   console.log("Form Data:", formData);
  //   alert("Route planned! (Mockup)");
  // };

  return (

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
          // className="h-full w-full rounded-r-lg"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; © OpenStreetMap contributors"
          />
          {/* <Marker position={center} icon={markerIcon} /> */}

           {/* Recenter map if bounds set */}
          {/* <RecenterMap bounds={bounds} /> */}

          {/* Start Marker */}
          {startCoords && (
            <Marker position={startCoords} icon={markerIcon}>
              <Popup>Start: {formData.start}</Popup>
            </Marker>
          )}

          {/* Destination Marker */}
          {destCoords && (
            <Marker position={destCoords} icon={destinationIcon}>
              <Popup>Destination: {formData.destination}</Popup>
            </Marker>
          )}

          {/* Route Line */}
            {startCoords && destCoords && (
              <Routing startCoords={startCoords} destCoords={destCoords} busyness={0} />
            )}
        </MapContainer>
      </div>
    </div>
  );
}
