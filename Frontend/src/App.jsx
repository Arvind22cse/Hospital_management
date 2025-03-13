import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Signin from './login/Signin.jsx';
import Dasboard from './dashboard/Dasboard.jsx';
import Doctordashboard from './dashboard/Doctordashboard.jsx';

function Layout() {
  const location = useLocation();
  
  return (
    <div>
      {/* Show Navbar only on Dashboard (/) */}
      {location.pathname === '/' && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Dasboard />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/doctor-dashboard" element={<Doctordashboard />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
