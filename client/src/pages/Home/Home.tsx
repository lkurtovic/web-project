import './Home.css';
import { useState, useEffect } from 'react';
import { ChartAreaInteractive } from '@/mine/LineChartDemo';
import { InputDemo } from '@/mine/InputDemo';
import { ModeToggle } from '@/mine/mode-toggle';
import { ThemeProvider } from '@/mine/theme-provider';
import { TableDemo } from '@/mine/TableDemo';
import { AvatarDemo } from '@/mine/AvatarDemo';
import { useNavigate } from 'react-router-dom';
import Demo from '@/mine/HeatMapDemo';

interface WeatherItem {
  index: number;
  temperature: number;
  precipitation: number;
}

interface CostData {
  [key: string]: number | string;
}

function Home() {
  const navigate = useNavigate();

  // Čitanje iz localStorage na mount
  const [weatherData, setWeatherData] = useState<WeatherItem[]>(() => {
    const saved = localStorage.getItem('weatherData');
    return saved ? JSON.parse(saved) : [];
  });

  const [costData, setCostData] = useState<CostData | null>(() => {
    const saved = localStorage.getItem('costData');
    return saved ? JSON.parse(saved) : null;
  });

  const [flightData, setFlightData] = useState<
    { date: string; count: number }[]
  >(() => {
    const saved = localStorage.getItem('flightData');
    return saved ? JSON.parse(saved) : [];
  });

  // Čuvanje u localStorage kad se podaci promene
  useEffect(() => {
    localStorage.setItem('weatherData', JSON.stringify(weatherData));
  }, [weatherData]);

  useEffect(() => {
    localStorage.setItem('costData', JSON.stringify(costData));
  }, [costData]);

  useEffect(() => {
    localStorage.setItem('flightData', JSON.stringify(flightData));
  }, [flightData]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex justify-between gap-3">
        <div>
          <p className="font-extrabold">T-buddy</p>
        </div>
        <div className="flex justify-end gap-3">
          <ModeToggle />
          <div onClick={() => navigate('/settings')} className="cursor-pointer">
            <AvatarDemo />
          </div>
        </div>
      </div>

      <div className="mb-5 mt-25">
        <h1 className="text-4xl">Search your city to travel</h1>
      </div>

      <div className="my-4">
        <InputDemo
          setWeatherData={setWeatherData}
          setCostData={setCostData}
          setFlightData={setFlightData}
        />
      </div>

      <div className="mt-25 mb-5">
        <h1 className="text-4xl">Temperature and precipitation</h1>
      </div>
      <ChartAreaInteractive data={weatherData} />

      <div className="mt-25 mb-5">
        <h1 className="text-4xl">Food and drinks</h1>
      </div>
      <div className="max-w-5xl text-center m-auto">
        <TableDemo costData={costData || undefined} />
      </div>

      <div className="mt-25 mb-5">
        <h1 className="text-4xl">Flights</h1>
      </div>
      <div className="flex justify-center mt-6">
        <Demo flightData={flightData} />
      </div>
    </ThemeProvider>
  );
}

export default Home;
