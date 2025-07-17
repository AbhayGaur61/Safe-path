import { GoogleMap, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { useMemo, useState, useEffect, useCallback } from "react";

export const CustomMarker3 = () => {
  const [markerPosition, setMarkerPosition] = useState({ lat: 13.0827, lng: 80.2707 }); // Start at Location A (Chennai Central)
  const [path, setPath] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [directionsResponseGreen, setDirectionsResponseGreen] = useState(null); // For green route

  const center = useMemo(() => ({ lat: 13.0651, lng: 80.2411 }), []);
  const destination = useMemo(() => ({ lat: 13.0475, lng: 80.2115 }), []); // Location B (Guindy)

  const svgMarker = {
    path: "M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805",
    fillColor: "red",
    fillOpacity: 2,
    strokeWeight: 1,
    rotation: 0,
    scale: 0.7,
  };

  const directionsCallbackGreen = useCallback((result, status) => {
    if (status === "OK") {
      setDirectionsResponseGreen(result);
      const routePath = result.routes[0].overview_path;
      setPath(routePath); // Set path to overview path coordinates
    } else {
      console.error("Directions request failed", status);
    }
  }, []);

  // Effect to move the marker along the path
  useEffect(() => {
    if (path.length > 0 && stepIndex < path.length) {
      const interval = setInterval(() => {
        setMarkerPosition(path[stepIndex]);  // Update marker's position
        setStepIndex((prev) => prev + 1);  // Move to next step
      }, 500);  // Adjust interval as needed for smoothness/speed

      return () => clearInterval(interval);  // Clear interval on cleanup
    }
  }, [path, stepIndex]);

  return (
    <GoogleMap mapContainerClassName="map-container" center={center} zoom={13}>
      <Marker position={markerPosition} icon={svgMarker} />

      {/* Directions Service for Green Route */}
      <DirectionsService
        options={{
          origin: { lat: 13.0827, lng: 80.2707 }, // Location A (Chennai Central)
          destination: destination, // Location B (Guindy)
          travelMode: "DRIVING",
        }}
        callback={directionsCallbackGreen}
      />

      {/* Directions Renderer for Green Route */}
      {directionsResponseGreen && (
        <DirectionsRenderer
          options={{
            directions: directionsResponseGreen,
            suppressMarkers: true, // Suppress A and B markers
            polylineOptions: {
              strokeColor: "#00FF00", // Green route
              strokeWeight: 4,
            },
          }}
        />
      )}
    </GoogleMap>
  );
};
