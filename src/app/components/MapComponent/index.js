import React, { useState, useRef } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { Box } from "@mui/material";




function MapComponent({ propertyCoordinates, clockCoordinates }) {
 
  const mapKey = "AIzaSyCsT-b8-J4wnqKYUBFROMPQr_IEYdjNiSg";

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: mapKey,
  });

  const defaultCoordinates1 = {
    lat: parseFloat(propertyCoordinates?.lat),
    lng: parseFloat(propertyCoordinates?.lng),
  };
  const defaultCoordinates2 = {
    lat: parseFloat(clockCoordinates?.lat),
    lng: parseFloat(clockCoordinates?.lng),
  };

  const [startPoint] = useState(defaultCoordinates1);
  const [endPoint] = useState(defaultCoordinates2);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  // Refs to hold timeout IDs to prevent flickering
  const showTimeout = useRef(null);
  const hideTimeout = useRef(null);

  // Handle mouse hover with delay
  const handleMouseOver = (marker) => {
    clearTimeout(hideTimeout.current); 
    showTimeout.current = setTimeout(() => {
      setHoveredMarker(marker);
      setShowInfoWindow(true);
    }, 200); 
  };

  const handleMouseOut = () => {
    clearTimeout(showTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setShowInfoWindow(false);
    }, 3000); 
  };

  if (loadError) {
    console.error("Error loading maps:", loadError);
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <Box sx={{ height: "350px", position: "relative" }}>
      <GoogleMap
        mapContainerStyle={{
          height: "100%",
          width: "100%",
          borderRadius: "20px",
        }}
        center={startPoint}
        zoom={10}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {/* Start Point Marker (Property) */}
        <Marker
          position={startPoint}
          icon={{
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="black">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
</svg>
`),
            scaledSize: new window.google.maps.Size(40, 40), // Adjust size as needed
          }}
          onMouseOver={() => handleMouseOver("start")}
          onMouseOut={handleMouseOut}
        />

        {/* InfoWindow for Start Point (Property) */}
        {hoveredMarker === "start" && showInfoWindow && (
          <InfoWindow
            position={startPoint}
            options={{ disableAutoPan: true }}
          >
            <div style={{ maxWidth: "200px",paddingTop:"10px"}}>
              <h4>Property Location</h4>
              
            </div>
          </InfoWindow>
        )}

        {/* End Point Marker (Clock Location) */}
        <Marker
          position={endPoint}
          onMouseOver={() => handleMouseOver("end")}
          onMouseOut={handleMouseOut}
        />

        {/* InfoWindow for End Point (Clock Location) */}
        {hoveredMarker === "end" && showInfoWindow && (
          <InfoWindow
            position={endPoint}
            options={{ disableAutoPan: true }}
          >
            <div style={{ maxWidth: "200px",paddingTop:"10px" }}>
              <h4>Clock Location</h4>
             
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </Box>
  );
}

export default MapComponent;
