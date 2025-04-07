"use client"

import "./App.css"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Listings from "./components/Listings"
import Account from "./pages/Account"
import ListingCreate from "./pages/ListingCreate"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import Buildings from "./pages/Buildings"
import Roommates from "./pages/Roommates"
import AdminDashboard from "./components/AdminDashboard"

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} />

      {currentPage === "home" ? (
        <div className="app-container">
          <h1 className="app-title">wluNest</h1>
          <p className="app-subtitle">
            Your ultimate platform for finding the perfect student housing near Wilfrid Laurier University. Browse
            listings, connect with roommates, and make your university housing search stress-free.
          </p>

          <div className="app-features">
            <div className="feature-item">
              <div className="feature-icon">🏠</div>
              <div className="feature-text">Find affordable housing options near campus</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <div className="feature-text">Connect with potential roommates</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📍</div>
              <div className="feature-text">Explore locations on interactive maps</div>
            </div>
          </div>

          <div className="button-container">
            <button className="browse-btn" onClick={() => setCurrentPage("listings")}>
              Browse Listings
            </button>
            <span className="or-text">or</span>
            <button className="login-btn" onClick={() => setCurrentPage("login")}>
              Login/Signup
            </button>
          </div>

          <div className="home-decoration"></div>
        </div>
      ) : currentPage === "listings" ? (
        <Listings />
      ) : currentPage === "login" ? (
        <Login setCurrentPage={setCurrentPage} />
      ) : currentPage === "account" ? (
        <Account />
      ) : currentPage === "ListingCreate" ? (
        <ListingCreate setCurrentPage={setCurrentPage} />
      ) : currentPage === "settings" ? (
        <Settings />
      ) : currentPage === "buildings" ? (
        <Buildings />
      ) : currentPage === "roommates" ? (
        <Roommates />
      ) : currentPage === "admin" && user?.role === "admin" ? (
        <AdminDashboard />
      ) : null}
    </div>
  )
}

export default App

