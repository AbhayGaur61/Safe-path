import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { useState } from "react";

// Updated coordinates for high-crime areas between Chengalpattu and Chennai
const markers = [
  { lat: 12.8533, lng: 79.9852, address: "Chengalpattu Town Center" },
  { lat: 12.8825, lng: 80.0694, address: "Vandalur Zoo area" },
  { lat: 12.8336, lng: 80.1903, address: "Kelambakkam Bus Stand" },
  { lat: 12.8412, lng: 80.2286, address: "OMR near Kelambakkam" },
  { lat: 12.6285, lng: 80.2038, address: "Thiruporur Town Center" },
  { lat: 12.7815, lng: 80.1924, address: "Vandalur-Kelambakkam Road" },
  { lat: 12.8551, lng: 80.2215, address: "Urapakkam Railway Station area" },
  { lat: 12.9134, lng: 80.1558, address: "Tambaram Sanatorium" },
  { lat: 12.9210, lng: 80.1335, address: "Chrompet Railway Station" },
  { lat: 12.9947, lng: 80.1678, address: "Pallavaram Bus Stand" },
  { lat: 12.9254, lng: 80.1734, address: "East Tambaram area" },
  { lat: 12.9205, lng: 80.1274, address: "Mudichur" },
  { lat: 12.8983, lng: 80.2281, address: "Thoraipakkam" },
  { lat: 12.9883, lng: 80.2248, address: "Velachery Railway Station" },
  { lat: 12.8753, lng: 80.2217, address: "Chennai Airport vicinity" },
  { lat: 12.8652, lng: 80.2202, address: "Chrompet Market area" },
  { lat: 12.8848, lng: 80.2442, address: "Areas near IT parks on OMR" },
  { lat: 12.8582, lng: 80.1886, address: "Back lanes of Kelambakkam" },
  { lat: 12.8265, lng: 80.0833, address: "Surrounding areas of Chengalpattu" },
  { lat: 12.9262, lng: 80.1687, address: "Market areas in Tambaram" },
  { lat: 12.9633, lng: 80.2055, address: "Chengalpattu Railway Station vicinity" },
  { lat: 12.9372, lng: 80.1595, address: "Areas around Tambaram Bus Terminus" },
  { lat: 12.8975, lng: 80.2265, address: "Industrial areas in Selaiyur" },
  { lat: 12.8813, lng: 80.2301, address: "Less frequented streets in Pallavaram" },
  { lat: 12.9052, lng: 80.1804, address: "Isolated housing in Mudichur" },
  { lat: 12.8456, lng: 80.1821, address: "Remote stretches along Chengalpattu Road" },
  { lat: 12.8205, lng: 80.1987, address: "Urapakkam residential areas" },
  { lat: 12.8919, lng: 80.1948, address: "Vandalur area after dark" },
  { lat: 12.8224, lng: 80.1866, address: "Thoraipakkam back lanes" },
  { lat: 12.9172, lng: 80.1168, address: "East Tambaram low surveillance areas" },
  { lat: 12.9326, lng: 80.1770, address: "Night-time safety concerns in Velachery" },
  // Add more coordinates here to reach a total of 40
];

export const InformationWindow = () => {
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds();
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  const handleMarkerClick = (id, lat, lng, address) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, address });
    setIsOpen(true);
  };

  return (
    <GoogleMap
      mapContainerClassName="map-container"
      onLoad={onMapLoad}
      onClick={() => setIsOpen(false)}
    >
      {markers.map(({ address, lat, lng }, ind) => (
        <Marker
          key={ind}
          position={{ lat, lng }}
          onClick={() => {
            handleMarkerClick(ind, lat, lng, address);
          }}
        >
          {isOpen && infoWindowData?.id === ind && (
            <InfoWindow
              onCloseClick={() => {
                setIsOpen(false);
              }}
            >
              <h3>{infoWindowData.address}</h3>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
};
