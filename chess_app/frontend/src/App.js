import React, { Component } from "react";
import { render } from "react-dom";
import CaptureComponent from "./pages/CapturePhotoPage";
import ChessPage from "./pages/ChessPage";
import Test from "./components/Test";
import HomePage from "./pages/HomePage";
import { Link, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import EditBoardPage from "./pages/EditBoardPage";
import AnalysingImagePage from "./pages/AnalysingImagePage";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/test" element={<Test />} />
        <Route path="/chess" element={<ChessPage />} />
        <Route path="/capture" element={<CaptureComponent />} />
        <Route path="/edit" element={<EditBoardPage />} />
        <Route path="/loading" element={<AnalysingImagePage />} />
      </Routes>
    );
  }
}

const appDiv = document.getElementById("app");
render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  appDiv
);
