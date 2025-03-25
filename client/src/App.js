import "./App.css";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Listings from "./components/Listings";
import Account from "./pages/Account";
import IndivListingView from "./pages/IndivListingView";
import Landing from "./pages/Landing";
import ListingCreate from "./pages/ListingCreate";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Buildings from "./pages/Buildings";
import { MapContainer, TileLayer, Marker} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";


function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />
      {currentPage === "home" ? (
        <div className="app-container">
          <h1>wluNest</h1>
          <p>Discover and compare apartment buildings and floor plans around Waterloo.</p>
          <div className="button-group">
            <button className="browse-btn" onClick={() => setCurrentPage("listings")}>Browse</button>
            <span className="or-text">or</span>
            <button className="login-btn" onClick={() => setCurrentPage("login")}>Login/Signup</button>
          </div>
        </div>
      ) : currentPage === "listings" ? (
        <Listings />
      )  : currentPage === "login" ? (
          <Login />
      ) : currentPage === "account" ? (
        <Account />
      ) : currentPage === "IndivListingView" ? (
        <IndivListingView />
      ) : currentPage === "Landing" ? (
        <Landing />
      ) : currentPage === "ListingCreate" ? (
        <ListingCreate />
      ) : currentPage === "settings" ? (
        <Settings />
      ) : currentPage === "buildings" ? (
        <Buildings />
      ) : null}
    </div>
  );
}

export default App;

export const MapView = () => {
  
  const markers = [
    {
      geocode: [43.474610511963334, -80.53183857043955], // 228 Albert St
      popup: "1"
    },
    {
      geocode: [43.48141252997309, -80.52619422703037], // 345 King St N
      popup: "2"
    },
    {
      geocode: [43.478498655583635, -80.51576776395635], // 81 University Ave
      popup: "3"
    },
    { 
      geocode: [43.47435142261021, -80.53429058139156], // 250 Lester St
      popup: "4"
    }
  ];
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [28, 28],

  });

  

  return (
    <MapContainer 
    center={[43.4738128656814, -80.53171014902999]} 
    zoom={15}
    style = {{height: "100%", width: "100%"}}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

      />
      {markers.map(marker => (
        <Marker position={marker.geocode} icon={customIcon} >
        </Marker>
      ))}
    </MapContainer>
  );
}