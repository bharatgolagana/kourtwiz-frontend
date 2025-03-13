import React from "react";
import "./Logo.css";

interface LogoProps {
  isExpanded: boolean;
}

const Logo: React.FC<LogoProps> = ({ isExpanded }) => {
  return (
    <div className="logo-container">
      <div className="logo">
        {!isExpanded && <img src="/src/assets/lg_logo.svg" alt="Logo" />}
      </div>
      {isExpanded && (
        <img
          src="/src/assets/kourtwiz_logo.png"
          alt="full_logo"
          style={{ width: "8rem" }}
        />
      )}
    </div>
  );
};

export default Logo;
