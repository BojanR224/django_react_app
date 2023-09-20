import React, { Component } from "react";
import { Link, BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function HomePage() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <Link to="/capture">
              <button>Take a Picture</button>
            </Link>
            <Link to="/chess">
              <button>Play Chess</button>
            </Link>
            <Link to="/test">
              <button>Test</button>
            </Link>
          </div>
        }
      />
    </Routes>
  );
}
