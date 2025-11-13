import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { WeatherData } from "../../types";
import "../../styles/Graph.css";

interface GraphProps {
  forecastFull: WeatherData[]; // todos os registros do forecast
  unit: "metric" | "imperial"; // unidade atual
}

const Graph: React.FC<GraphProps> = ({ forecastFull, unit }) => {
  const [selectedDay, setSelectedDay] = useState<string>(""); // dia selecionado YYYY-MM-DD
  const [dayData, setDayData] = useState<WeatherData[]>([]);

  const tempSymbol = unit === "metric" ? "°C" : "°F";

  // cria array com os próximos 5 dias (YYYY-MM-DD) baseado em forecastFull
  const days: string[] = Array.from(
    new Set(forecastFull.map((f) => f.dt_txt.split(" ")[0]))
  );

  // atualiza os dados do gráfico quando muda o dia selecionado
  useEffect(() => {
    if (!selectedDay) return;

    const filtered = forecastFull.filter((f: WeatherData) =>
      f.dt_txt.startsWith(selectedDay)
    );
    setDayData(filtered);
  }, [selectedDay, forecastFull]);
  console.log(forecastFull);
  return (
    <section className="graph-section">
      {/* Header: título + seletor */}
      <div className="graph-header">
        <h1>Temperature Evolution</h1>

        <div className="day-selector">
          <label htmlFor="day">Select a day: </label>
          <select
            id="day"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {days.map((day: string) => (
              <option key={day} value={day}>
                {new Date(day).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Container do gráfico */}
      <div className="graph-container">
        {dayData.length > 0 ? (
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={dayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dt_txt"
                tickFormatter={(val) => val.split(" ")[1].slice(0, 5)}
              />
              <YAxis
                label={{
                  value: `Temp (${tempSymbol})`,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                labelFormatter={(val) => `Time: ${val.split(" ")[1]}`}
                formatter={(value: number) => [
                  `${value.toFixed(1)}${tempSymbol}`,
                  "Temp",
                ]}
              />
              <Line
                type="monotone"
                dataKey={(d: WeatherData) => d.main.temp}
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No data available for this day.</p>
        )}
      </div>
    </section>
  );
};

export default Graph;
