/* global google */
import { GoogleMap, Polygon, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import React, { useState, useCallback, useRef } from "react";

export const Geofence = () => {
  const [polygonPath, setPolygonPath] = useState();
  const [directionsResponseRed, setDirectionsResponseRed] = useState(null);
  const [dangerMarkers, setDangerMarkers] = useState([]);
  const hasFetchedDirections = useRef(false); // Ref to track if directions have been fetched

  const origin = { lat: 13.0827, lng: 80.2707 }; // Chennai Central
  const destination = { lat: 13.0475, lng: 80.2115 }; // Guindy

  const polygonOptions = {
    strokeColor: "yellow",
    strokeOpacity: 0.5,
    strokeWeight: 3.0,
    fillColor: "red",
    fillOpacity: 0.2,
  };

  const bufferDistance = 0.00008; // Buffer distance for geofence

  const directionsCallbackRed = useCallback((result, status) => {
    if (status === "OK") {
      if (result.routes[1]) {
        const redRoute = result.routes[1].overview_path;

        // Create geofenced polygon around the route
        const x = redRoute.map(
          (point) => new google.maps.LatLng(point.lat() + bufferDistance, point.lng() - bufferDistance)
        );
        const y = redRoute.reverse().map(
          (point) => new google.maps.LatLng(point.lat() - bufferDistance, point.lng() + bufferDistance)
        );
        const coordinates = [...x, ...y];
        const areaBoundary = coordinates.map((point) => {
          return { lat: point.lat(), lng: point.lng() };
        });
        setPolygonPath(areaBoundary);

        // Calculate danger signs positions (excluding start and end points)
        const interval = Math.floor((redRoute.length - 2) / 5); // Exclude start and end
        const dangerSignsPositions = [];
        for (let i = 1; i <= 5; i++) {
          dangerSignsPositions.push(redRoute[i * interval]);
        }
        setDangerMarkers(dangerSignsPositions);

        setDirectionsResponseRed(result); // Store directions response for the red route
      }
    } else {
      console.error(`Error fetching directions for geofencing: ${status}`);
    }
  }, []);

  return (
    <GoogleMap
      mapContainerClassName="map-container"
      center={{ lat: 13.0651, lng: 80.2411 }}
      zoom={13}
    >
      {/* Directions Service to fetch the alternative (red) route */}
      {!hasFetchedDirections.current && (
        <DirectionsService
          options={{
            origin: origin,
            destination: destination,
            travelMode: "DRIVING",
            provideRouteAlternatives: true, // Request alternative routes
          }}
          callback={(result, status) => {
            hasFetchedDirections.current = true; // Prevent re-fetching
            directionsCallbackRed(result, status);
          }}
        />
      )}

      {/* Directions Renderer for the red route (faint) */}
      {directionsResponseRed && directionsResponseRed.routes[1] && (
        <DirectionsRenderer
          options={{
            directions: {
              ...directionsResponseRed,
              routes: [directionsResponseRed.routes[1]],  // Select the second alternative route
            },
            polylineOptions: {
              strokeColor: "#FF0000",   // Red route
              strokeOpacity: 0.4,       // Faint route
              strokeWeight: 2,          // Thinner line
            },
          }}
        />
      )}

      {/* Render the geofenced area as a Polygon */}
      {polygonPath && <Polygon path={polygonPath} options={polygonOptions} />}

      {/* Markers for danger signs along the alternative (red) route */}
      {dangerMarkers.map((position, index) => (
        <Marker
          key={index}
          position={position}
          icon={{
            url: "https://maps.google.com/mapfiles/kml/shapes/caution.png",  // Danger sign icon
            scaledSize: new window.google.maps.Size(30, 30),  // Adjust the size as needed
          }}
        />
      ))}
    </GoogleMap>
  );
};
