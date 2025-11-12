import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

interface NavbarProps {
  setCity: (city: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCity }) => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [lastCity, setLastCity] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Forecast", path: "/" },
    { name: "Graph", path: "/graph" },
    { name: "Map", path: "/map" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setCity(query); // envia para o App
    setLastCity(query);
    setQuery("");
  };

  return (
    <header>
      <div className="container">
        <div className="logo">🌤️ WeatherApp</div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={location.pathname === link.path ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={lastCity ? lastCity : "Search city..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
