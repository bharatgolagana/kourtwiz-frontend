import "./Header.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [navigation, setNavigation] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const navToggle = () => {
      if (window.innerWidth < 900) {
        setNavigation(false);
      }
    };
    window.addEventListener("resize", navToggle);
    return () => {
      window.removeEventListener("resize", navToggle);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setNavigation(false);
      }
    };

    if (navigation) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigation]);

  return (
    <div className="header">
      <nav className="nav" ref={navRef}>
        <div className="nav-links">
          <p><a href="#features" className="nav-spacing">Features </a> <a href="#pricing" className="nav-spacing">Pricing </a>
          <a href="#about" className="nav-spacing">About </a>
          <a href="#contact" className="nav-spacing">Contact </a></p>
        </div>
        <div className="nav-buttons">
          <button className="btn" onClick={() => navigate("/login")}>Login</button>
          <button className="btn primary" onClick={() => navigate("/register")}>Try it Out</button>
        </div>
      </nav>
    </div>
  );
};

export default Header;
