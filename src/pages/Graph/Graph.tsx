import React, { useState, useEffect, useMemo } from "react";
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
  forecastFull: WeatherData[];
  unit: "metric" | "imperial";
}

const Graph: React.FC<GraphProps> = ({ forecastFull, unit }) => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDay, setSelectedDay] = useState<string>(today);
  const [dayData, setDayData] = useState<WeatherData[]>([]);

  const tempSymbol = unit === "metric" ? "°C" : "°F";

  const days: string[] = Array.from(
    new Set(forecastFull.map((f) => f.dt_txt.split(" ")[0]))
  );

  useEffect(() => {
    if (!selectedDay) return;
    const filtered = forecastFull.filter((f) =>
      f.dt_txt.startsWith(selectedDay)
    );
    setDayData(filtered);
  }, [selectedDay, forecastFull]);

  useEffect(() => {
    if (!selectedDay && days.includes(today)) {
      setSelectedDay(today);
    }
  }, [days, selectedDay, today]);

  // 🔹 Calcula limites dinâmicos do eixo Y
  const [yMin, yMax] = useMemo(() => {
    if (dayData.length === 0) return [0, 0];
    const temps = dayData.map((d) => d.main.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const padding = 2; // 🔹 margem extra de 2 graus
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [dayData]);

  return (
    <section className="graph-section">
      <div className="graph-header">
        <h1>📈 Hourly Forecast</h1>

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

      <div className="graph-container">
        {dayData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="dt_txt"
                tickFormatter={(val) => val.split(" ")[1].slice(0, 5)}
              />
              <YAxis
                domain={[yMin, yMax]} // 🔹 domínio dinâmico
                label={{
                  value: `Temp (${tempSymbol})`,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip
                cursor={{ stroke: "#1a70f1", strokeWidth: 1, opacity: 0.3 }}
                wrapperStyle={{
                  pointerEvents: "none", // 🔹 evita interferência no cursor
                  position: "absolute", // 🔹 não afeta layout
                }}
                contentStyle={{
                  backgroundColor: "#202b3c",
                  border: "1px solid #1a70f1",
                  borderRadius: "10px",
                  color: "#d2d9e2",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
                labelStyle={{
                  color: "#1a70f1",
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: "#d2d9e2",
                }}
                labelFormatter={(val) => `Time: ${val.split(" ")[1]}`}
                formatter={(value: number) => [
                  `${value.toFixed(1)}${tempSymbol}`,
                  "Temp",
                ]}
              />
              <Line
                type="monotone"
                dataKey={(d: WeatherData) => d.main.temp}
                stroke="#1a70f1" // 🔹 azul principal
                strokeWidth={3} // linha mais espessa
                dot={{
                  r: 4,
                  stroke: "#1a70f1",
                  strokeWidth: 2,
                  fill: "#202b3c",
                }}
                activeDot={{ r: 6, fill: "#1a70f1", strokeWidth: 0 }}
                strokeLinejoin="round" // 🔹 cantos suavizados
                strokeLinecap="round" // 🔹 terminações arredondadas
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="placeholder">
            Please search a valid city to see the graph.
          </p>
        )}
      </div>
    </section>
  );
};

export default Graph;
