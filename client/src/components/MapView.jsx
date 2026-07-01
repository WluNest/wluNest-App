/**
 * MapView Component
 *
 * This component renders a map displaying real estate listings as markers using the Leaflet 
 * library. Each listing is represented by a marker that, when clicked, shows a popup with 
 * details about the listing, including the title, price, number of beds, and number of baths.
 *
 * Key Features:
 *   - Displays a map using OpenStreetMap tiles.
 *   - Renders markers on the map for each listing with geographic coordinates.
 *   - Displays a custom icon for each listing's marker.
 *   - Each marker has a popup that shows key details of the listing when clicked.
 *
 * Dependencies:
 *   - React
 *   - react-leaflet (for integrating Leaflet with React)
 *   - leaflet (for rendering the map and markers)
 *   - OpenStreetMap (used for the tile layer)
 *   - CSS for styling (`leaflet.css`)
 *
 * Props:
 *   - `listings` (array): List of listing objects, each containing latitude, longitude, title, 
 *     price, bed, and bath.
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
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
