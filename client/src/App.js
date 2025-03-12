import './App.css';
import React from "react";

function App() {
  return (
    <div className="app-container">
      <h1>wluNest</h1>
      <p>Discover and compare apartment buildings and floor plans around WLU.</p>
      <div className='button-group'>
        <button className='browse-btn'>Browse</button>
        <span className='or-text'>or</span>
        <button className='login-btn'>Login</button>
      </div>
    </div>
  );
}

export default App;
