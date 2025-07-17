import { DirectionsRenderer, DirectionsService, GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useMemo, useState } from "react";

export const CustomMarker1 = () => {
  const center = useMemo(() => ({ lat: 13.0651, lng: 80.2411 }), []);
  const [fullDirections, setFullDirections] = useState(null);

  const markers = [
    { lat: 13.0827, lng: 80.2707, color: "green" },  // Start (Chennai Central)
    { lat: 13.0475, lng: 80.2115, color: "red" }     // End (Guindy)
  ];

  const origin = { lat: 13.0827, lng: 80.2707 };
  const destination = { lat: 13.0475, lng: 80.2115 };

  const directionsCallback = useCallback((result, status) => {
    if (status === "OK" && result.routes.length >= 2) {
      setFullDirections(result);
    } else {
      console.error("Directions request failed or didn't return 2 routes:", status);
    }
  }, []);

  return (
    <GoogleMap
      mapContainerClassName="map-container"
      center={center}
      zoom={13}
    >
      {/* Custom Markers */}
      {markers.map(({ lat, lng, color }) => (
        <Marker
          key={`${lat}-${lng}`}
          position={{ lat, lng }}
          icon={`http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`}
        />
      ))}

      {/* Fetch directions once */}
      {!fullDirections && (
        <DirectionsService
          options={{
            origin,
            destination,
            travelMode: "DRIVING",
            provideRouteAlternatives: true
          }}
          callback={directionsCallback}
        />
      )}

      {/* Red Route (Primary) */}
      {fullDirections && (
        <DirectionsRenderer
          options={{
            directions: {
              ...fullDirections,
              routes: [fullDirections.routes[0]],  // First route
            },
            polylineOptions: {
              strokeColor: "#FF0000", // 🔴 Red
              strokeWeight: 5,
            },
            suppressMarkers: true,
          }}
        />
      )}

      {/* Green Route (Alternative) */}
      {fullDirections && fullDirections.routes[1] && (
        <DirectionsRenderer
          options={{
            directions: {
              ...fullDirections,
              routes: [fullDirections.routes[1]],  // Second route
            },
            polylineOptions: {
              strokeColor: "#00FF00", // 🟢 Green
              strokeWeight: 5,
            },
            suppressMarkers: true,
          }}
        />
      )}
    </GoogleMap>
  );
};
