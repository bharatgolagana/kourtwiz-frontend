import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Pickleball Logo"  style={{ width: "50px", height: "auto" }}/>
      </div>
      <nav className="nav-links">
        <a href="/">HOME</a>
        <a href="/about">ABOUT</a>
        <a href="/services">SERVICES</a>
        <a href="/events">EVENTS</a>
        <a href="/products">PRODUCTS</a>
        <button className="contact-btn" onClick={() => navigate("/contact")}>
          CONTACT
        </button>
      </nav>
    </header>
  );
};

export default Header;
