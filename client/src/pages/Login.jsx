import React, { useState } from "react";
import "./Login.css";
import axios from "axios";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        if (!username || !first_name || !last_name || !email || !password) {
          return setError("Please fill in all fields.");
        }
  
        const res = await axios.post("http://localhost:5001/api/signup", {
          username,
          first_name,
          last_name,
          email,
          password,
        });
  
        alert(res.data.message);
        setIsSignUp(false);
      } else {
        if (!identifier || !password) {
          return setError("Please enter your username/email and password.");
        }
  
        const res = await axios.post("http://localhost:5001/api/login", {
          identifier,
          password,
        });
        alert(res.data.message);
        localStorage.setItem("token", res.data.token); // this shoudl save the token
  

      }
    }
    catch (err) {
      console.error("Failed to authenticate:", err);
      setError(err.response.data.message);

      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("Cannot reach server. Please make sure the backend is running.");
      } else {
        setError("An unexpected error occurred.");
      }
      
    }

  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{isSignUp ? "Sign up" : "Login"} to wluNest</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-signup-form">
          {isSignUp ? (
            <>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
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
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="identifier">Username or Email</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          )}

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
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;