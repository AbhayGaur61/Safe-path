import { GoogleMap, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import React, { useMemo, useState, useCallback } from "react";

export const CustomMarker2 = () => {
  const center = useMemo(() => ({ lat: 13.0651, lng: 80.2411 }), []);

  const [dangerMarkers, setDangerMarkers] = useState([]);
  const [directionsResponseRed, setDirectionsResponseRed] = useState(null);

  const origin = { lat: 13.0827, lng: 80.2707 }; // Chennai Central
  const destination = { lat: 13.0475, lng: 80.2115 }; // Guindy

  // Callback to handle the directions response
  const directionsCallbackRed = useCallback((result, status) => {
    if (status === "OK") {
      // Assuming you want the second route (alternative route)
      if (result.routes[1]) {
        const redRoute = result.routes[1].overview_path;
        const dangerSignsPositions = [];

        // Exclude the first and last points, place 5 markers on the remaining route
        const interval = Math.floor((redRoute.length - 2) / 5); // Adjust length to exclude start and end
        for (let i = 1; i <= 5; i++) { // Start from index 1 and go until second last
          dangerSignsPositions.push(redRoute[i * interval]);
        }

        setDangerMarkers(dangerSignsPositions);
        setDirectionsResponseRed(result); // Store directions response to render the faded red route
      } else {
        console.error("No alternative route available for danger markers.");
      }
    } else {
      console.error(`Error fetching directions for danger markers: ${status}`);
    }
  }, []);

  return (
    <GoogleMap mapContainerClassName="map-container" center={center} zoom={13}>
      {/* Directions Service to fetch the alternative (red) route */}
      <DirectionsService
        options={{
          origin: origin,
          destination: destination,
          travelMode: "DRIVING",
          provideRouteAlternatives: true, // Request alternative routes
        }}
        callback={directionsCallbackRed}
      />

      {/* Directions Renderer for faded red route */}
      {directionsResponseRed && directionsResponseRed.routes[1] && (
        <DirectionsRenderer
          options={{
            directions: {
              ...directionsResponseRed,
              routes: [directionsResponseRed.routes[1]],  // Select the second alternative route
            },
            polylineOptions: {
              strokeColor: "#FF0000",   // Red route
              strokeOpacity: 0.4,       // Make the route fainter
              strokeWeight: 2,          // Thinner line for the faded route
            },
          }}
        />
      )}

      {/* Markers for the danger signs on the alternative (red) route */}
      {dangerMarkers.map((position, index) => (
        <Marker
          key={index}
          position={position}
          icon={{
            url: "https://maps.google.com/mapfiles/kml/shapes/caution.png",  // Danger sign icon
            scaledSize: new window.google.maps.Size(24, 24),  // Make the icon smaller
          }}
        />
      ))}
    </GoogleMap>
  );
};
