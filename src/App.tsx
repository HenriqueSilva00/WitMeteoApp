import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Forecast from "./pages/Forecast/Forecast";
import Graph from "./pages/Graph/Graph";
import MapView from "./pages/Map/MapView";
import { WeatherData } from "./types";

const App: React.FC = () => {
  const [city, setCity] = useState(""); // cidade selecionada
  const [forecast, setForecast] = useState<WeatherData[]>([]); // forecast completo
  const [unit, setUnit] = useState<"metric" | "imperial">("metric"); // unidade de temperatura
  const [forecastFull, setForecastFull] = useState<WeatherData[]>([]); // todos os registros para o gráfico

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Passa setCity para o Navbar */}
        <Navbar setCity={setCity} />

        <main className="flex-grow p-6">
          <Routes>
            {/* Passa city, forecast e setForecast para o Forecast */}
            <Route
              path="/"
              element={
                <Forecast
                  city={city}
                  forecast={forecast}
                  setForecast={setForecast}
                  forecastFull={forecastFull}
                  setForecastFull={setForecastFull}
                  unit={unit}
                  setUnit={setUnit}
                />
              }
            />

            {/* Passa forecast e unit para o Graph */}
            <Route
              path="/graph"
              element={<Graph forecastFull={forecastFull} unit={unit} />}
            />

            <Route path="/map" element={<MapView />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
