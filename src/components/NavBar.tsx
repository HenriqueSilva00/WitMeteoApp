import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";
import WeatherIcon from "../assets/WeatherIcon.png";

interface NavbarProps {
  setCity: (city: string) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCity, menuOpen, setMenuOpen }) => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [lastCity, setLastCity] = useState("");

  const links = [
    { name: "Forecast", path: "/", icon: "🌤️" },
    { name: "Graph", path: "/graph", icon: "📈" },
    { name: "Map", path: "/map", icon: "🗺️" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setCity(query); // envia para o App
    setLastCity(query);
    setQuery("");
  };

  return (
    <div className="header-wrapper">
      <header>
        <div className="container">
          <div className="logo">
            <img src={WeatherIcon} alt="WeatherApp" className="logo-img" />
            <span>WeatherApp</span>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            {links.map((link) => (
              <Link key={link.path} to={link.path}>
                <span className="link-icon">{link.icon}</span>
                {link.name}
              </Link>
            ))}

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={lastCity ? lastCity : "City, Country or Continent"}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
