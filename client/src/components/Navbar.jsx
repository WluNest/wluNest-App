/**
 * Navbar Component
 *
 * This component renders the navigation bar for the application, allowing users to navigate
 * between different pages such as Listings, Roommates, Settings, and Create Listing. It also 
 * provides login and logout functionality, along with special admin access to the Admin Dashboard.
 * 
 * Key Features:
 *   - Displays a logo and clickable navigation items.
 *   - Conditionally renders navigation links based on the user’s authentication status.
 *   - Allows users to navigate between pages (Listings, Roommates, Settings, Create Listing, etc.).
 *   - Provides login and logout functionality, with logout refreshing the app state.
 *   - Admin users see an additional link to the Admin Dashboard.
 *
 * Dependencies:
 *   - React
 *   - authService (for managing user authentication)
 *
 * Props:
 *   - `setCurrentPage` (function): A function to update the current page state in the parent component.
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
"use client"

import { useState, useEffect } from "react"
import "./Navbar.css"
import authService from "../services/AuthService"

function Navbar({ setCurrentPage }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get current user from auth service
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    authService.logout()
    setCurrentPage("home")
    alert("Logged out successfully!")
    window.location.reload() // Refresh to reset app state
  }

  const handleLogin = () => {
    setCurrentPage("login")
  }

  return (
    <div className="navbar">
      {/* Left Section: Logo */}
      <div className="nav-left" onClick={() => setCurrentPage("home")}>
        <span className="logo">wluNest</span>
      </div>

      {/* Center Section: Nav Links */}
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
        {/* Admin Dashboard link */}
        {user && user.isAdmin() && (
          <span className="nav-item" onClick={() => setCurrentPage("admin")}>
            Admin Dashboard
          </span>
        )}
      </div>

      {/* Right Section: Auth */}
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

