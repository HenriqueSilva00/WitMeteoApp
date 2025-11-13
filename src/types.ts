export interface WeatherData {
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
  clouds: { all: number };
  wind: { speed: number; deg: number };
  rain?: { "3h"?: number };
  snow?: { "3h"?: number };
  visibility: number;

  // Coordenadas da cidade
  coord: {
    lat: number;
    lon: number;
  };
}
