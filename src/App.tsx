import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Forecast from "./pages/Forecast/Forecast";
import Graph from "./pages/Graph/Graph";
import MapView from "./pages/Map/MapView";
import { WeatherData } from "./types";

const App: React.FC = () => {
  const [city, setCity] = useState("Londres"); // cidade selecionada
  const [forecast, setForecast] = useState<WeatherData[]>([]); // forecast completo
  const [unit, setUnit] = useState<"metric" | "imperial">("metric"); // unidade de temperatura
  const [forecastFull, setForecastFull] = useState<WeatherData[]>([]); // todos os registros para o gráfico
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_KEY = "73122f48cfc4498f9761ce606145d571";

  useEffect(() => {
    if (!city) return;

    const fetchForecast = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${unit}&lang=en`
        );
        const data = await res.json();

        if (data.cod !== "200") {
          setError(data.message);
          setForecast([]);
          setForecastFull([]); // 🔹 Limpa os dados antigos
        } else {
          const forecastWithCoord = data.list.map((item: any) => ({
            ...item,
            coord: { lat: data.city.coord.lat, lon: data.city.coord.lon },
          }));
          setForecastFull(forecastWithCoord);
          const dailyNoon = forecastWithCoord.filter((f: any) =>
            f.dt_txt.includes("12:00:00")
          );
          setForecast(dailyNoon.slice(0, 5));
        }
      } catch {
        setError("Error fetching data.");
        setForecast([]);
        setForecastFull([]); // 🔹 Limpa também aqui
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city, unit]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Passa setCity para o Navbar */}
        <Navbar
          setCity={setCity}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />

        <main className={`flex-grow p-6 ${menuOpen ? "blurred" : ""}`}>
          <Routes>
            <Route
              path="/"
              element={
                <Forecast
                  city={city}
                  forecast={forecast}
                  forecastFull={forecastFull}
                  setForecast={setForecast}
                  setForecastFull={setForecastFull}
                  unit={unit}
                  setUnit={setUnit}
                  loading={loading}
                  error={error}
                />
              }
            />
            <Route
              path="/graph"
              element={
                <Graph
                  city={city}
                  forecastFull={forecastFull}
                  unit={"metric"}
                  error={error}
                />
              }
            />
            <Route
              path="/map"
              element={
                <MapView
                  forecastFull={forecastFull}
                  unit={"metric"}
                  error={error}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
