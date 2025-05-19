import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
       HOSPITAL MANAGEMENT
      </Link>

      <ul className={mobileMenu ? "nav-links nav-active" : "nav-links"}>
        <li>
          <button className="avatar-link" onClick={() => navigate("/general")}>
            ho
          </button>
        </li>
        <li>
          <div className="avatar-link" onClick={() => navigate("/login", { state: { defaultUser: "Doctor" } })}>
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Avatar"
              className="avatar"
            />
          </div>
        </li>
      </ul>

      
    </nav>
  );
};

export default Navbar;
