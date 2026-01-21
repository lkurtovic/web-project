import { createContext, useContext, useState, ReactNode } from "react";

// Tipovi
interface WeatherItem {
  index: number;
  temperature: number;
  precipitation: number;
}

interface CostData {
  [key: string]: number | string;
}

interface WeatherContextType {
  weatherData: WeatherItem[];
  setWeatherData: (data: WeatherItem[]) => void;
  costData: CostData | null;
  setCostData: (data: CostData | null) => void;
  flightData: { date: string; count: number }[];
  setFlightData: (data: { date: string; count: number }[]) => void;
}

// Kreiraj context
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Provider komponenta
export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherItem[]>([]);
  const [costData, setCostData] = useState<CostData | null>(null);
  const [flightData, setFlightData] = useState<{ date: string; count: number }[]>([]);

  return (
    <WeatherContext.Provider value={{ weatherData, setWeatherData, costData, setCostData, flightData, setFlightData }}>
      {children}
    </WeatherContext.Provider>
  );
}

// Custom hook za lakši pristup
export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) throw new Error("useWeather must be used within a WeatherProvider");
  return context;
}
