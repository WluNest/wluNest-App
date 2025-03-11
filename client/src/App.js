import './App.css';
import React from "react"

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      <h1 className="text-5xl font-bold text-purple-700">wluNest</h1>
      <p className="text-lg text-gray-700 mt-4">
        Discover and compare apartment buildings, floor plans, and amenities in your area.
      </p>
      <button className="mt-6 px-6 py-3 bg-yellow-400 text-purple-800 font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition">
        Get Started
      </button>
    </div>
  );
}

export default App;
