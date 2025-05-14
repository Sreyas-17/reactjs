import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import "./App.css";
import Home from "./Home";

function AppContent() {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const openSite = () => {
    window.open("https://www.bridgelabz.com", "_blank");
  };

  //UC6 Validate the user name
  const handleInput = (event) => {
    const value = event.target.value;
    setUserName(value);

    const nameRegex = /^[A-Z][a-zA-Z\s]{2,}$/;
    if (value.length < 3) {
      setError("Name must be at least 3 characters long.");
    } 
    else if (!nameRegex.test(value)) {
      setError("Name must start with a capital letter and be at least 3 letters.");
    } 
    else {
      setError("");
    }
  };

  return (
    <div className="container">
      <div className="content">

        {/* UC2: Interpolation */}
        {/* <p>Hello from BridgeLabz</p> */}

        <div className="header">

          {/* UC5: User name input and display */}
          <h1 className="username"> Hello {userName} from BridgeLabz </h1>

          {/* UC3 and UC4: Property Binding for logo */}
          <div className="logo">
            <img src={logo} alt="BridgeLabz Logo" onClick={openSite} />
          </div>

          <div className="input">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={handleInput}
            />
          </div>

        </div>

        {error && <p className="error">{error}</p>}

        <div className="Details">
          <p>At BridgeLabz, we're a community of</p>
          <ul>
            <li>technologists</li>
            <li>thinkers</li>
            <li>builders</li>
          </ul>
          <p>
            Working together to keep the Tech Employability of Engineers alive and
            accessible, so Tech Companies worldwide can get contributors and
            creators for Technology Solutions. We believe this act of human
            collaboration across an employability platform is essential to individual
            growth and our collective future.
          </p>
          <p>
            To Know about us, visit <a href="https://www.bridgelabz.com" target="_blank" rel="noreferrer">BridgeLabz</a> to learn even more about our mission
            i.e. <strong>Employability to all</strong>.
          </p>
        </div>
   
        <button onClick={() => navigate("/")}>Home</button> {/* UC8 Navigate to home page*/}
     
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;
