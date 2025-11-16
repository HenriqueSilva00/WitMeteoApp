import React from "react";
import "../styles/Footer.css";
import githubLogo from "../assets/github.png";
import linkedinLogo from "../assets/linkedin.png";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Weatherly
        </p>
        <p className="footer-subtext">
          Developed for <strong>WIT Challenge</strong> by{" "}
          <strong>Henrique Silva</strong>
        </p>
        <div className="footer-icons">
          <a
            href="https://www.linkedin.com/in/henrique-silva-b20257198"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={linkedinLogo} alt="LinkedIn" className="footer-icon" />
          </a>
          <a
            href="https://github.com/HenriqueSilva00?tab=overview&from=2025-02-01&to=2025-02-28"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={githubLogo} alt="GitHub" className="footer-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
