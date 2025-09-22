// routePlannerController.js
import express from "express"
import router from "express"
const router = express.Router();
const haversine = require('haversine-distance'); // small helper (or implement your own)
const polyline = require('@mapbox/polyline'); // optional for polyline handling
const { getRouteFromRoutingAPI, getDetourDistanceViaRoutingAPI } = require('./routingService');
const Station = require('./models/station'); // mongoose model

// utils
function kmBetween(a, b) {
  const m = haversine(a, b);
  return m / 1000;
}

// normalize utility
function normalizeArray(arr) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (max === min) return arr.map(_ => 0.5);
  return arr.map(v => (v - min) / (max - min));
}

router.post('/api/route-plan', async (req, res, next) => {
  try {
    const { currentFuelLitres, mileageKmpl, start, destination, preferences = {} } = req.body;
    const w = {
      weight_detour: preferences.weight_detour ?? 0.4,
      weight_remaining: preferences.weight_remaining ?? 0.3,
      weight_rating: preferences.weight_rating ?? 0.2,
      weight_price: preferences.weight_price ?? 0.1,
    };

    const rangeKm = currentFuelLitres * mileageKmpl;

    // 1) Get route geometry & distance via routing provider
    // getRouteFromRoutingAPI should return {distanceKm, polyline, routePoints: [{lat,lng,cumDistanceKm}] }
    const route = await getRouteFromRoutingAPI(start, destination);
    const routeDistanceKm = route.distanceKm;

    // 2) If range >= routeDistance -> can reach
    const canReachDestination = rangeKm >= routeDistanceKm;

    // 3) Query stations near route corridor (use a bounding box or $geoNear with route bounding boxes)
    // For simplicity query all stations within X km of route bounding box (server-side improvement: use spatial index).
    // We will query stations within 3km of route's bounding box center - replace with a proper corridor query in production.
    const bbox = computeBBox(route.routePoints); // implement computeBBox([...])
    const stationsCandidate = await Station.find({
      location: {
        $geoWithin: {
          $box: [[bbox.minLng, bbox.minLat], [bbox.maxLng, bbox.maxLat]]
        }
      }
    }).limit(500).lean();

    // 4) For each station compute metrics
    const enriched = [];
    for (const st of stationsCandidate) {
      const stPoint = { lat: st.location.coordinates[1], lng: st.location.coordinates[0] };

      // find nearest point on route and its cumulative distance
      const nearest = findNearestRoutePointAndCumDist(route.routePoints, stPoint); // implement
      const distanceAlongRouteKm = nearest.cumDistanceKm;

      // detourDistance: we can approximate by straight-line from route point to station * 2,
      // or call routing API for precise driving detour: getDetourDistanceViaRoutingAPI(routePoint, stPoint)
      const straight = kmBetween({lat: nearest.lat, lng: nearest.lng}, stPoint);
      let detourDistanceKm = straight * 2; // approximate
      // (Optionally) call routing API for precise detour (slower). Use if you need accuracy:
      // detourDistanceKm = await getDetourDistanceViaRoutingAPI({lat: nearest.lat, lng: nearest.lng}, stPoint);

      const distanceToStationFromStartKm = distanceAlongRouteKm + detourDistanceKm;
      const fuelNeededToStation = distanceToStationFromStartKm / mileageKmpl;
      const canReachStation = fuelNeededToStation <= currentFuelLitres;

      const distanceStationToDestKm = Math.max(0, routeDistanceKm - distanceAlongRouteKm);

      enriched.push({
        ...st,
        lat: stPoint.lat, lng: stPoint.lng,
        distanceAlongRouteKm,
        detourDistanceKm,
        distanceToStationFromStartKm,
        fuelNeededToStation,
        canReachStation,
        distanceStationToDestKm
      });
    }

    // filter only reachable
    const reachable = enriched.filter(s => s.canReachStation);

    // 5) If not enough fuel to reach destination, score reachable stations
    let recommended = null;
    if (!canReachDestination && reachable.length > 0) {
      // compute normalizations
      const detours = reachable.map(s => s.detourDistanceKm);
      const remainingDists = reachable.map(s => s.distanceStationToDestKm);
      const ratings = reachable.map(s => s.rating ?? 3.0);
      const prices = reachable.map(s => s.avg_price_per_litre ?? median(pricesPlaceholder())); // implement median fallback

      const nd = normalizeArray(detours);
      const nr = normalizeArray(remainingDists);
      const nrate = normalizeArray(ratings);
      const nprice = normalizeArray(prices);

      const scored = reachable.map((s, i) => {
        const score = w.weight_detour * (1 - nd[i]) +
                      w.weight_remaining * (1 - nr[i]) +
                      w.weight_rating * nrate[i] +
                      w.weight_price * (1 - nprice[i]);
        return {...s, score};
      });

      scored.sort((a,b) => b.score - a.score);
      recommended = scored[0];
    }

    // 6) Compose message
    let message;
    if (canReachDestination) {
      message = "You can reach your destination safely with your current fuel.";
    } else if (!reachable.length) {
      message = "You cannot reach destination with current fuel and there are no reachable petrol stations along your route. Consider rerouting or stopping earlier.";
    } else {
      message = `Stop at ${recommended.name} to minimize detour and save fuel.`;
    }

    // 7) Return response
    res.json({
      route: { distanceKm: routeDistanceKm, polyline: route.polyline },
      currentRangeKm: rangeKm,
      canReachDestination,
      message,
      recommendedStation: recommended ? {
        id: recommended._id,
        name: recommended.name,
        lat: recommended.lat,
        lng: recommended.lng,
        distanceToStationFromStartKm: recommended.distanceToStationFromStartKm,
        detourDistanceKm: recommended.detourDistanceKm,
        fuelNeededToStation: recommended.fuelNeededToStation,
        score: recommended.score
      } : null,
      reachableStations: reachable.map(s => ({
        id: s._id, name: s.name, lat: s.lat, lng: s.lng,
        detourDistanceKm: s.detourDistanceKm,
        fuelNeededToStation: s.fuelNeededToStation,
        distanceStationToDestKm: s.distanceStationToDestKm
      }))
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
