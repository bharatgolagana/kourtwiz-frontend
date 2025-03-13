import "./Header.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [navigation, setNavigation] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement | null>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
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
      <button
        className="header-btn"
        type="button"
        onClick={() => navigate("/home")}
      >
        Login
      </button>
    </div>
  );
};

export default Header;
