import React from 'react';
import { useState } from 'react';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignUp) {
            if (name && email && password) {
                alert('Sign-up successful');
            } else {
                setError('Please fill in all fields.');
            }
        } 
    }

  return (
    <div className="login-signup-container">
        <h1>{isSignUp ? "Sign Up" : "Login"} to wluNest</h1>

        <form onSubmit={handleSubmit} className='login-signup-form'>
            {isSignUp && (
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
            )}

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
        </form>

        <div className="toggle=form">
            <p>
                {isSignUp ? "Already have an Account?" : "Don't have an account?"}
                <button onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? "Login" : "Sign UP"}
                </button>
            </p>
        </div>
        
    </div>
  );
};

export default Login;
