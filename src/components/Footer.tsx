import React from "react";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer>
      <p>
        © {new Date().getFullYear()} WeatherApp — Developed for WIT Challenge
      </p>
    </footer>
  );
};

export default Footer;
