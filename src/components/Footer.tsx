import React from "react";
import "../styles/Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} WeatherApp
        </p>
        <p className="footer-subtext">
          Developed for <strong>WIT Challenge</strong> — Developer:{" "}
          <strong>Henrique Silva</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
