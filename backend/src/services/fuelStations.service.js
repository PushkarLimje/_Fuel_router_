// backend/src/services/fuelStations.service.js
import axios from 'axios';

// Get location name from coordinates (reverse geocoding)
async function getLocationName(lat, lon) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: {
          lat,
          lon,
          format: 'json'
        }
      }
    );
    
    if (response.data && response.data.address) {
      const addr = response.data.address;
      return addr.city || addr.town || addr.village || addr.suburb || 'Your Location';
    }
    return 'Your Location';
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Your Location';
  }
}

// Fetch fuel stations near coordinates using Overpass API
async function fetchNearbyFuelStations(lat, lon, radiusKm = 10) {
  try {
    // Overpass API query for fuel stations
    const query = `
      [out:json];
      (
        node["amenity"="fuel"](around:${radiusKm * 1000},${lat},${lon});
        way["amenity"="fuel"](around:${radiusKm * 1000},${lat},${lon});
      );
      out body;
    `;

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      query,
      {
        headers: { 'Content-Type': 'text/plain' },
        timeout: 10000 // 10 second timeout
      }
    );

    const stations = response.data.elements || [];
    
    return {
      count: stations.length,
      stations: stations.map(station => ({
        id: station.id,
        name: station.tags?.name || 'Unnamed Station',
        brand: station.tags?.brand || 'Unknown',
        lat: station.lat || station.center?.lat,
        lon: station.lon || station.center?.lon,
        address: station.tags?.['addr:street'] || ''
      }))
    };
  } catch (error) {
    console.error('Error fetching fuel stations:', error.message);
    return { count: 0, stations: [] };
  }
}

// Main function to get fuel stations by coordinates
export async function getFuelStationsByCoordinates(lat, lon, radiusKm = 10) {
  const locationName = await getLocationName(lat, lon);
  const result = await fetchNearbyFuelStations(lat, lon, radiusKm);

  return {
    ...result,
    locationName
  };
}

// Legacy function (keep for backwards compatibility)
async function getCityCoordinates(city) {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: city,
          format: 'json',
          limit: 1
        }
      }
    );
    
    if (response.data && response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lon: parseFloat(response.data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
    return null;
  }
}

export async function getFuelStationsByCity(cityName, radiusKm = 10) {
  const coordinates = await getCityCoordinates(cityName);
  
  if (!coordinates) {
    return { count: 0, stations: [], error: 'City not found' };
  }

  const result = await fetchNearbyFuelStations(
    coordinates.lat, 
    coordinates.lon, 
    radiusKm
  );

  return result;
}