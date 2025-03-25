import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (username && firstname && lastname && email && password) {
        alert("Sign-up successful");
      } else {
        setError("Please fill in all fields.");
      }
    } else {
      // Handle login logic here
      if ((email || username) && password) {
        alert("Login successful");
      } else {
        setError("Please enter email and password.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{isSignUp ? "Sign up" : "Login"} to wluNest</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-signup-form">
          {isSignUp && (
          <div className="name-container">
            <div className="form-group first-last-name">
              <label htmlFor="firstname">First</label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </div>
            <div className="form-group first-last-name">              
              <label htmlFor="lastname">Last</label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
              </div>
          </div>
          )}
          
          <div className="form-group">
          <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {isSignUp ? "Sign up" : "Login"}
          </button>
        </form>

        <div className="toggle-form">
          <p>
            {isSignUp ? "Already have an Account?" : "Don't have an account?"}
            <button onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
