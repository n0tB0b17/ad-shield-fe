import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet'; 

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const LocationMap = ({ latitude, longitude, zoomLevel = 10, popupText = "Location" }) => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
        console.warn("Invalid coordinates provided to LocationMap:", latitude, longitude);
        return null;
    }

    const position = [lat, lon];

    return (
        <MapContainer
            key={`${lat}-${lon}`}
            center={position}
            zoom={zoomLevel}
            scrollWheelZoom={false} // Optional: disable scroll wheel zoom
            style={{ height: '300px', width: '100%', marginTop: '20px', zIndex: 0 }} // Ensure height is set, zIndex might help overlay issues
        >
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    {popupText} <br /> Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default LocationMap;