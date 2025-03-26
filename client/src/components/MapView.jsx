import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [28, 28],
});

const MapView = ({ listings }) => {
  return (
    <MapContainer
      center={[43.4738, -80.5317]} // Center of Waterloo
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {listings.map((listing) =>
        listing.latitude && listing.longitude ? (
          <Marker
            key={listing.listing_id}
            position={[parseFloat(listing.latitude), parseFloat(listing.longitude)]}
            icon={customIcon}
          >
            <Popup>
              <strong>{listing.title}</strong><br />
              ${listing.price} · 🛏 {listing.bed} · 🛁 {listing.bath}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default MapView;
