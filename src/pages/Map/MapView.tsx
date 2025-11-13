import React, { useEffect, useState } from "react";
import "../../styles/MapView.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { WeatherData } from "../../types";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.heat";

interface MapViewProps {
  forecastFull: WeatherData[];
  unit: "metric" | "imperial";
}

declare module "leaflet" {
  function heatLayer(latlngs: L.LatLngExpression[], options?: any): L.Layer;
}

const Heatmap: React.FC<{ points: [number, number, number][] }> = ({
  points,
}) => {
  const map = useMap();
  useEffect(() => {
    const heat = L.heatLayer(points, { radius: 40, blur: 30, maxZoom: 17 });
    heat.addTo(map);

    return () => {
      heat.remove();
    };
  }, [map, points]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({ forecastFull, unit }) => {
  // Filtra os pontos válidos
  const points: [number, number, number][] = forecastFull
    .filter(
      (d) => d.coord && d.coord.lat !== undefined && d.coord.lon !== undefined
    )
    .map((d) => [d.coord!.lat, d.coord!.lon, 15]);

  console.log("Heatmap points:", points);

  // Determina o centro da cidade (primeira coordenada válida)
  const cityCenter: [number, number] =
    points.length > 0 ? [points[0][0], points[0][1]] : [40.0, -8.0]; // fallback

  return (
    <div className="map-container">
      <MapContainer center={cityCenter} zoom={12} className="leaflet-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Heatmap points={points} />
      </MapContainer>
    </div>
  );
};

export default MapView;
