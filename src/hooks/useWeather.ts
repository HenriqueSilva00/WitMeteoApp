import { useState } from "react";

export function useWeather() {
  const [data, setData] = useState(null);
  return { data, setData };
}
