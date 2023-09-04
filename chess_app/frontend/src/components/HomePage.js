import React, { Component } from "react";
import CaptureComponent from "./CapturePhotoButton";
import ChessGame from "./ChessGame";
import Test from "./Test";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="/chess" element={<ChessGame />} />
          <Route path="/capture" element={<CaptureComponent />} />
        </Routes>
      </Router>
    );
  }
}
