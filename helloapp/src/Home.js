import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Home.css";

// UC9: Creating Home component 
function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Hello World from BridgeLabz</h1>
      <button onClick={() => navigate('/app')}>App</button>
    </div>
  );
}

export default Home;
