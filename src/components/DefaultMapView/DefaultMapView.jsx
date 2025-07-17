/* global google */
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";

const DefaultMapView = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const center = { lat: 13.08216, lng: 80.2411 }; // fallback center

  // ✅ Ensure Google Maps API is loaded
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your key
  });

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!isLoaded) return <div>Loading...</div>; // wait for API

  return (
    <GoogleMap
      mapContainerClassName="map-container"
      center={currentLocation || center}
      zoom={13}
    >
      {currentLocation && (
        <Marker
          position={currentLocation}
          icon={{
            url: "https://maps.google.com/mapfiles/kml/shapes/man.png",
            scaledSize: new google.maps.Size(40, 40), // ✅ now safe to use
          }}
        />
      )}
    </GoogleMap>
  );
};

export default DefaultMapView;
