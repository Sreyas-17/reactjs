import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import AddressBook from "./components/AddressBook/AddressBook";
import Home from "./components/Home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<AddressBook />} />
        <Route path="/edit/:id" element={<AddressBook />} />
      </Routes>
    </Router>
  );
}

export default App;
