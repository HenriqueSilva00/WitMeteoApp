import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import "../../styles/Forecast.css";
import { WeatherData } from "../../types";

interface ForecastProps {
  city: string;
  forecast: WeatherData[]; // 12h00 para forecast
  setForecast: React.Dispatch<React.SetStateAction<WeatherData[]>>;
  forecastFull: WeatherData[]; // todos os registros
  setForecastFull: React.Dispatch<React.SetStateAction<WeatherData[]>>;
  unit: "metric" | "imperial";
  setUnit: React.Dispatch<React.SetStateAction<"metric" | "imperial">>;
}

const API_KEY = "73122f48cfc4498f9761ce606145d571";

const Forecast: React.FC<ForecastProps> = ({
  city,
  forecast,
  setForecast,
  forecastFull,
  setForecastFull,
  unit,
  setUnit,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        } else {
          // Adiciona coordenadas a cada item do forecast
          const forecastWithCoord: WeatherData[] = data.list.map(
            (item: any) => ({
              ...item,
              coord: {
                lat: data.city.coord.lat,
                lon: data.city.coord.lon,
              },
            })
          );

          // Guarda todos os registros para o gráfico (com coordenadas)
          setForecastFull(forecastWithCoord);

          // Pega apenas o registro das 12h00 para o forecast diário
          const dailyNoon = forecastWithCoord.filter((f) =>
            f.dt_txt.includes("12:00:00")
          );
          setForecast(dailyNoon.slice(0, 5));
        }
      } catch (err) {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [city, unit, setForecast, setForecastFull]);

  const tempSymbol = unit === "metric" ? "°C" : "°F";

  if (loading) return <p className="loading">Loading forecast...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!forecast.length)
    return <p className="info">Search a city to see the forecast.</p>;

  return (
    <section className="forecast-section">
      <div className="forecast-header">
        <h1>📍{city}</h1>
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
            unit === "metric" ? f.wind.speed * 3.6 : f.wind.speed; // km/h or mph
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
