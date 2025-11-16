import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";
import WeatherIcon from "../assets/WeatherIcon.png";
import ForecastIcon from "../assets/Forecast.png";
import GraphIcon from "../assets/graph.png";
import MapIcon from "../assets/Map.png";

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
    { name: "Forecast", path: "/", icon: ForecastIcon },
    { name: "Graph", path: "/graph", icon: GraphIcon },
    { name: "Map", path: "/map", icon: MapIcon },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setCity(query); // envia para a App
    setLastCity(query);
    setQuery("");
    setMenuOpen(false); // fecha o menu após a pesquisa
  };

  const handleLinkClick = () => {
    setMenuOpen(false); // fecha o menu ao clicar em um link
  };

  return (
    <div className="header-wrapper">
      <header>
        <div className="container">
          <div className="logo">
            <img src={WeatherIcon} alt="Weatherly" className="logo-img" />
            <span>Weatherly</span>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>

          <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="nav-link"
                onClick={handleLinkClick} // fecha menu ao clicar numa opção
              >
                <img src={link.icon} alt={link.name} className="nav-icon" />
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
