import React, { useState } from "react";
import "./Admindashboard.css";

function Admindashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <nav className="navbar">
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          <li><a  href="/admindoctor" className="nav-a">Doctor</a></li>
          <li><a href="/adminhosp" className="nav-a">Hospital</a></li>
          <li><a href="/adminvaccine" className="nav-a">Vaccine</a></li>
        <a href="/login" >  <button style={{backgroundColor:"red",color:"white",borderRadius:"3px",width:"85px",height:"40px"}} >Logout</button></a>
        </ul>
      </nav>
    </div>
  );
}

export default Admindashboard;
