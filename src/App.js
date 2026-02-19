import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FilmsPage from './pages/FilmsPage';
import FilmDetails from './pages/FilmDetails';
import ActorDetails from './pages/ActorDetails';
import CustomerPage from './pages/CustomerPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">LM Sakila Project</h1>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/films">Films</Link></li>
              <li><Link to="/customers">Customers</Link></li>
            </ul>
          </div>
        </nav>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/films" element={<FilmsPage />} />
            <Route path="/films/:filmId" element={<FilmDetails />} />
            <Route path="/actors/:actorId" element={<ActorDetails />} />
            <Route path="/customers" element={<CustomerPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
