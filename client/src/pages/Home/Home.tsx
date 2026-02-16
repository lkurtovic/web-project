'use client';

import './Home.css';
import { useState, useEffect } from 'react';
import { ChartAreaInteractive } from '@/mine/LineChartDemo';
import { InputDemo } from './Components/InputDemo';
import { ModeToggle } from '@/mine/mode-toggle';
import { ThemeProvider } from '@/mine/theme-provider';
import { TableDemo } from '@/mine/TableDemo';
import { AvatarDemo } from '@/mine/AvatarDemo';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/firebase';
import Demo from '@/mine/HeatMapDemo';

import { API_ENDPOINTS } from '@/lib/api';

// --- INTERFACES ---
interface WeatherItem {
  index: number;
  temperature: number;
  precipitation: number;
}

interface CostData {
  [key: string]: number | string;
}

interface UserPreference {
  id: number;
  quantity: number;
}

interface HotelStats {
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  hotelCount: number;
}

function Home() {
  const navigate = useNavigate();

  // --- STATE INICIJALIZACIJA (Iz localStorage-a) ---
  const [activeCity, setActiveCity] = useState<string>(
    () => localStorage.getItem('activeCity') || '',
  );

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

  const [hotelStats, setHotelStats] = useState<HotelStats | null>(() => {
    const saved = localStorage.getItem('hotelStats');
    return saved ? JSON.parse(saved) : null;
  });

  const [userPreferences, setUserPreferences] = useState<UserPreference[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // --- DOHVAĆANJE PREFERENCIJA (MongoDB) ---
  // Ovo ostaje jer ovisi o UID-u ulogiranog korisnika pri mountu
  useEffect(() => {
    const fetchUserPreferences = async (uid: string) => {
      try {
        const res = await fetch(API_ENDPOINTS.USER_FOOD_PREFERENCES(uid));
        if (res.ok) {
          const data = await res.json();
          setUserPreferences(data);
        }
      } catch (err) {
        console.error('Greška pri dohvaćanju preferencija hrane:', err);
      } finally {
        setIsDataLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserPreferences(user.uid);
      } else {
        setIsDataLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* Header */}
      <div className="flex justify-between gap-3 p-4">
        <div>
          <p
            className="font-extrabold text-xl cursor-pointer"
            onClick={() => window.location.reload()}
          >
            T-buddy
          </p>
        </div>
        <div className="flex justify-end gap-3 items-center">
          <ModeToggle />
          <div onClick={() => navigate('/settings')} className="cursor-pointer">
            <AvatarDemo />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Search Section */}
        <div className="mb-5 mt-20">
          <h1 className="text-4xl">Search your city to travel</h1>
        </div>

        <div className="my-4">
          <InputDemo
            setWeatherData={setWeatherData}
            setCostData={setCostData}
            setFlightData={setFlightData}
            setHotelStats={setHotelStats}
            setActiveCity={setActiveCity}
          />
        </div>

        {/* --- Dinamički sadržaj (Prikazuje se samo ako postoji grad) --- */}
        {activeCity && (
          <div className="animate-in fade-in duration-700">
            <div className="my-20">
              <h2 className="text-5xl font-bold tracking-tight">
                {activeCity}
              </h2>
            </div>

            {/* Weather Section */}
            <div className="mt-25 mb-5">
              <h1 className="text-4xl">Temperature and precipitation</h1>
            </div>
            <div className="w-full">
              <ChartAreaInteractive data={weatherData} />
            </div>

            {/* Food Section */}
            <div className="mt-25 mb-5">
              <h1 className="text-4xl">Food and drinks</h1>
            </div>
            <div className="max-w-5xl m-auto bg-card p-6 rounded-xl border shadow-sm">
              {isDataLoading ? (
                <p className="text-center py-10 animate-pulse">
                  Loading preferences...
                </p>
              ) : (
                <TableDemo
                  costData={costData || undefined}
                  userPreferences={userPreferences}
                />
              )}
            </div>
            <div className="text-muted-foreground mt-4 text-sm">
              Cost of one day worth of food
            </div>

            {/* Flights Section */}
            <div className="mt-25 mb-5">
              <h1 className="text-4xl">Flights</h1>
            </div>
            <div className="flex justify-center pb-10">
              {flightData.length > 0 ? (
                <Demo flightData={flightData} />
              ) : (
                <div className="h-40 flex items-center text-muted-foreground">
                  No flight data available for this city.
                </div>
              )}
            </div>

            {/* Hotels Section */}
            <div className="mt-20 mb-5">
              <h1 className="text-4xl">Hotels</h1>
            </div>
            {hotelStats ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-10">
                <StatCard
                  label="Cheapest Stay"
                  value={`$${hotelStats.minPrice.toFixed(2)}`}
                  color="text-green-500"
                />
                <StatCard
                  label="Average Hotel"
                  value={`$${hotelStats.avgPrice.toFixed(2)}`}
                />
                <StatCard
                  label="Luxury Option"
                  value={`$${hotelStats.maxPrice.toFixed(2)}`}
                  color="text-red-500"
                />
                <StatCard
                  label="Hotels Found"
                  value={hotelStats.hotelCount.toString()}
                />
              </div>
            ) : (
              <p className="text-muted-foreground">No hotel stats available.</p>
            )}
            <div className="text-muted-foreground mt-4 pb-20 text-sm">
              Cost of one day stay at a hotel
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

// --- POMOĆNA KOMPONENTA ZA KARTICE ---
function StatCard({
  label,
  value,
  color = '',
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center space-y-2">
      <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">
        {label}
      </p>
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

export default Home;
