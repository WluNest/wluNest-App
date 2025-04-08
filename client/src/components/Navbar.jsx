// navbar component

"use client"

import { useState, useEffect } from "react"
import "./Navbar.css"
import authService from "../services/AuthService"

function Navbar({ setCurrentPage }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    //get current user from auth service
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    authService.logout()
    setCurrentPage("home")
    alert("Logged out successfully!")
    window.location.reload() // refresh to reset app state
  }

  const handleLogin = () => {
    setCurrentPage("login")
  }

  return (
    <div className="navbar">
      {/* left section */}
      <div className="nav-left" onClick={() => setCurrentPage("home")}>
        <span className="logo">wluNest</span>
      </div>

      {/* center section */}
      <div className="nav-center">
        <span className="nav-item" onClick={() => setCurrentPage("listings")}>
          Listings
        </span>
        <span className="nav-item" onClick={() => setCurrentPage("roommates")}>
          Roommates
        </span>
        {user && (
          <span className="nav-item" onClick={() => setCurrentPage("settings")}>
            Settings
          </span>
        )}
        {user && (
          <span className="nav-item" onClick={() => setCurrentPage("ListingCreate")}>
            Create Listing
          </span>
        )}
        {/* admin dashboard link */}
        {user && user.isAdmin() && (
          <span className="nav-item" onClick={() => setCurrentPage("admin")}>
            Admin Dashboard
          </span>
        )}
      </div>

      {/* right section: auth */}
      <div className="nav-right">
        {user ? (
          <span className="nav-item logout-item" onClick={handleLogout}>
            Logout ➜
          </span>
        ) : (
          <span className="nav-item login-item" onClick={handleLogin}>
            ➜ Log in
          </span>
        )}
      </div>
    </div>
  )
}

export default Navbar

