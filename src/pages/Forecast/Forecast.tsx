import React, { useState, useEffect } from "react";
import "../../styles/Forecast.css";
import { WeatherData } from "../../types";
import NotFoundImg from "../../assets/404NotFound.png";

interface ForecastProps {
  city: string;
  forecast: WeatherData[];
  forecastFull: WeatherData[];
  setForecast: React.Dispatch<React.SetStateAction<WeatherData[]>>;
  setForecastFull: React.Dispatch<React.SetStateAction<WeatherData[]>>;
  unit: "metric" | "imperial";
  setUnit: React.Dispatch<React.SetStateAction<"metric" | "imperial">>;
  loading: boolean;
  error: string;
}

const API_KEY = "73122f48cfc4498f9761ce606145d571";

const Forecast: React.FC<ForecastProps> = ({
  city,
  forecast,
  unit,
  setUnit,
  loading,
  error,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const tempSymbol = unit === "metric" ? "°C" : "°F";
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  if (loading) return <p className="loading">Loading forecast...</p>;

  if (error) {
    return (
      <div className="forecast-error-container">
        <img
          src={NotFoundImg}
          alt="Error 404 - City not Found"
          className="forecast-error-img"
        />
        <div className="forecast-error-text">
          <p>We could not fetch the weather forecast for the requested city.</p>
          <p>Please check the city name and try again.</p>
          <p>
            <em>Perhaps "{city}" does not exist.</em>
          </p>
        </div>
      </div>
    );
  }
  if (!forecast.length)
    return <p className="info">Search a city to see the forecast.</p>;

  return (
    <section className="forecast-section">
      <div className="forecast-header">
        <h1>
          📍{city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()} -{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </h1>
        <div className="unit-toggle" data-unit={unit}>
          <span
            className={`toggle-option ${unit === "metric" ? "active" : ""}`}
            onClick={() => setUnit("metric")}
          >
            Metric (°C)
          </span>
          <span
            className={`toggle-option ${unit === "imperial" ? "active" : ""}`}
            onClick={() => setUnit("imperial")}
          >
            Imperial (°F)
          </span>
          <div className="toggle-slider" />
        </div>
      </div>

      <div className="forecast-grid">
        {forecast.map((f) => {
          const windSpeed =
            unit === "metric" ? f.wind.speed * 3.6 : f.wind.speed; // conversão métrica
          const visibility =
            unit === "metric"
              ? (f.visibility / 1000).toFixed(1) + " km"
              : (f.visibility / 1609.34).toFixed(1) + " mi";

          return (
            <div key={f.dt_txt} className="forecast-card">
              <p className="date">
                {new Date(f.dt_txt).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                })}
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`}
                alt={f.weather[0].description}
              />

              <p className="temp">
                {f.main.temp.toFixed(1)}
                {tempSymbol}
              </p>
              <p className="desc">{f.weather[0].description}</p>

              <div className="details">
                <p>
                  🌡️ Max: {f.main.temp_max.toFixed(1)}
                  {tempSymbol} | Min: {f.main.temp_min.toFixed(1)}
                  {tempSymbol}
                </p>
                <p>
                  💨 Wind: {windSpeed.toFixed(1)}{" "}
                  {unit === "metric" ? "km/h" : "mph"}
                </p>
                <p>💧 Humidity: {f.main.humidity}%</p>
                <p>☁️ Cloudiness: {f.clouds.all}%</p>
                {f.rain?.["3h"] && <p>🌧️ Rain: {f.rain["3h"]} mm</p>}
                {f.snow?.["3h"] && <p>❄️ Snow: {f.snow["3h"]} mm</p>}
                <p>📏 Pressure: {f.main.pressure} hPa</p>
                <p>👁️ Visibility: {visibility}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Forecast;
