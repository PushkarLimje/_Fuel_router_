import L from "leaflet";

class TomTomRouter {
  constructor(options) {
    this.options = options;
  }

  route(waypoints, callback, context, options) {
    const key = this.options.apiKey;
    if (!key) {
      return callback.call(context, null, [{ error: "Missing TomTom API Key" }]);
    }

    const coords = waypoints
      .map(wp => `${wp.latLng.lat},${wp.latLng.lng}`)
      .join(":");

    const url = `https://api.tomtom.com/routing/1/calculateRoute/${coords}/json?key=${key}&computeBestOrder=false`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data.routes || data.routes.length === 0) {
          return callback.call(context, null, [{ error: "No route found" }]);
        }

        const route = data.routes[0];
        const coordinates = route.legs
          .flatMap(leg => leg.points.map(pt => L.latLng(pt.latitude, pt.longitude)));

        const summary = {
          totalDistance: route.summary.lengthInMeters,
          totalTime: route.summary.travelTimeInSeconds
        };

        const result = [{
          name: "TomTom Route",
          coordinates,
          summary,
          inputWaypoints: waypoints,
          waypoints
        }];

        callback.call(context, null, result);
      })
      .catch(err => {
        callback.call(context, err);
      });
  }
}

export default function tomTomRouter(options) {
  return new TomTomRouter(options);
}
