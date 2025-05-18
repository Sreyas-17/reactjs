import React from "react";
import PayrollForm from "./components/payroll-form/payroll-form.jsx";
import Home from "./components/home/home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<PayrollForm />} />
        <Route path="/edit/:id" element={<PayrollForm />} />
      </Routes>
    </Router>
  );
}

export default App;
