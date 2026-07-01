import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Listings from "./components/Listings";
import Account from "./pages/Account";
import ListingCreate from "./pages/ListingCreate";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Buildings from "./pages/Buildings";
import Roommates from "./pages/Roommates";
import AdminDashboard from "./components/AdminDashboard";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "home",
      user: null,
    };
  }

  componentDidMount() {
    const stored = localStorage.getItem("user");
    if (stored) {
      this.setState({ user: JSON.parse(stored) });
    }
  }

  setCurrentPage = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const { currentPage, user } = this.state;

    return (
      <div>
        <Navbar setCurrentPage={this.setCurrentPage} />

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
              <button className="browse-btn" onClick={() => this.setCurrentPage("listings")}>
                Browse Listings
              </button>
              <span className="or-text">or</span>
              <button className="login-btn" onClick={() => this.setCurrentPage("login")}>
                Login/Signup
              </button>
            </div>

            <div className="home-decoration"></div>
          </div>
        ) : currentPage === "listings" ? (
          <Listings />
        ) : currentPage === "login" ? (
          <Login setCurrentPage={this.setCurrentPage} />
        ) : currentPage === "account" ? (
          <Account />
        ) : currentPage === "ListingCreate" ? (
          <ListingCreate setCurrentPage={this.setCurrentPage} />
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
    );
  }
}

export default App;
