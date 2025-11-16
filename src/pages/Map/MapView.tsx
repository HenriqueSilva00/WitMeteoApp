import React, { useEffect, useState } from "react";
import "../../styles/MapView.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { WeatherData } from "../../types";
import * as L from "leaflet";
import "leaflet.heat";

interface MapViewProps {
  forecastFull: WeatherData[];
  unit: "metric" | "imperial";
  error?: string;
}

interface LeafletHeatLayer extends L.Layer {
  addTo(map: L.Map): this;
  remove(): this;
}

declare module "leaflet" {
  function heatLayer(latlngs: L.LatLngExpression[], options?: any): L.Layer;
}

const Heatmap: React.FC<{ points: [number, number, number][] }> = ({
  points,
}) => {
  const map = useMap();
  useEffect(() => {
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 20,
      minOpacity: 0.3,
      maxZoom: 10,
    });
    heat.addTo(map);

    return () => {
      heat.remove();
    };
  }, [map, points]);
  console.log(points);
  return null;
};

const MapView: React.FC<MapViewProps> = ({ forecastFull, unit }) => {
  const temps = forecastFull.map((d) => d.main.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);

  const points: [number, number, number][] = forecastFull
    .filter(
      (d) => d.coord && d.coord.lat !== undefined && d.coord.lon !== undefined
    )
    .map((d, i) => {
      const temp =
        unit === "metric" ? d.main.temp : (d.main.temp - 32) * (5 / 9);
      const intensity = (temp - minTemp) / (maxTemp - minTemp);

      // Pequena variação para teste
      const offsetLat = (Math.random() - 0.5) * 0.05;
      const offsetLon = (Math.random() - 0.5) * 0.05;

      return [d.coord.lat + offsetLat, d.coord.lon + offsetLon, intensity];
    });

  const cityCenter: [number, number] =
    points.length > 0 ? [points[0][0], points[0][1]] : [40.0, -8.0];

  const RecenterMap: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      if (points.length > 0) {
        map.setView([points[0][0], points[0][1]], 12, { animate: true });
      } else {
        map.setView([40.0, -8.0], 5, { animate: true });
      }
    }, [points, map]);
    return null;
  };

  return (
    <div className="map-container">
      <MapContainer center={cityCenter} zoom={12} className="leaflet-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Heatmap points={points} />
        <RecenterMap />
      </MapContainer>
    </div>
  );
};

export default MapView;
