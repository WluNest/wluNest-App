/**
 * Login Component
 *
 * This component handles the user authentication process, supporting both login and sign-up functionality. 
 * It allows users to either sign up for a new account or log in with their existing credentials, 
 * providing real-time feedback based on their inputs.
 *
 * Key Features:
 *   - Allows users to sign up with a username, first name, last name, email, and password.
 *   - Enables existing users to log in using either their username or email and password.
 *   - Displays error messages when required fields are missing or incorrect.
 *   - Provides a loading state while the authentication request is being processed.
 *   - Automatically toggles between login and sign-up forms based on user selection.
 *   - Alerts users upon successful login or sign-up.
 *   - Includes footer with copyright information.
 *
 * Props:
 *   - `setCurrentPage` (function): A function that updates the current page in the app (e.g., to navigate to the listings page upon successful login).
 *
 * Author: [Your Name or Team Name]
 * Created: [Date]
 */
"use client"

import { useState } from "react"
import "./Login.css"
import authService from "../services/AuthService"

const Login = ({ setCurrentPage }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [identifier, setIdentifier] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isSignUp) {
        if (!username || !first_name || !last_name || !email || !password) {
          setError("Please fill in all fields.")
          setIsLoading(false)
          return
        }

        const response = await authService.signup({
          username,
          first_name,
          last_name,
          email,
          password,
        })

        alert(response.message)
        setIsSignUp(false)
      } else {
        if (!identifier || !password) {
          setError("Please enter your username/email and password.")
          setIsLoading(false)
          return
        }

        const user = await authService.login(identifier, password)
        // Force a page reload to update all components with new auth state
        window.location.href = '/listings'
      }
    } catch (error) {
      setError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">wluNest</div>
        <p className="login-subtitle">
          {isSignUp
            ? "Create your account to find your perfect student housing"
            : "Welcome back! Log in to continue your housing search"}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-signup-form">
          {isSignUp ? (
            <>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input id="first_name" value={first_name} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input id="last_name" value={last_name} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : isSignUp ? "Sign up" : "Login"}
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

        <div className="login-footer"> {new Date().getFullYear()} wluNest - Student Housing Made Simple</div>
      </div>
    </div>
  )
}

export default Login
