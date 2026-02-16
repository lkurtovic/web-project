'use client';

import { useState } from 'react';
import Input from '@/components/ui/input';
import { auth } from '@/firebase';

interface InputDemoProps {
  setWeatherData: React.Dispatch<React.SetStateAction<any[]>>;
  setCostData: React.Dispatch<React.SetStateAction<any | null>>;
  setFlightData: React.Dispatch<
    React.SetStateAction<{ date: string; count: number }[]>
  >;
  setHotelStats: React.Dispatch<React.SetStateAction<any | null>>;
  setActiveCity: React.Dispatch<React.SetStateAction<string>>;
}

export function InputDemo({
  setWeatherData,
  setCostData,
  setFlightData,
  setHotelStats,
  setActiveCity,
}: InputDemoProps) {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && city.trim()) {
      setLoading(true);

      // --- OPTIONAL: Resetiranje starih podataka prije nove pretrage ---
      // setWeatherData([]);
      // setCostData(null);
      // setFlightData([]);
      // setHotelStats(null);

      try {
        const uid = auth.currentUser?.uid || '';

        // 1️⃣ KORAK: Vrijeme i država (zbog geocodinga na serveru)
        const weatherRes = await fetch(
          `${process.env.REACT_APP_API_URL}/weather?city=${encodeURIComponent(city)}`,
        );

        if (!weatherRes.ok) throw new Error('City not found');
        const weatherJson = await weatherRes.json();

        // Obrada i spremanje vremena
        if (weatherJson.forecast) {
          const transformedWeather = weatherJson.forecast.map(
            (item: any, index: number) => ({
              index,
              temperature: item.avgTemperature,
              precipitation: item.avgPrecipitation,
            }),
          );
          setWeatherData(transformedWeather);
          localStorage.setItem(
            'weatherData',
            JSON.stringify(transformedWeather),
          );
        }

        const country = weatherJson.country;

        // 2️⃣ KORAK: Paralelno dohvaćanje ostalih podataka (brže je)
        const [costsRes, flightsRes, hotelsRes] = await Promise.all([
          fetch(
            `${process.env.REACT_APP_API_URL}/costs?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
          ),
          fetch(
            `${process.env.REACT_APP_API_URL}/flights?city=${encodeURIComponent(city)}&uid=${uid}`,
          ),
          fetch(
            `${process.env.REACT_APP_API_URL}/hotels/stats?city=${encodeURIComponent(city)}`,
          ),
        ]);

        // --- Obrada troškova ---
        if (costsRes.ok) {
          const costs = await costsRes.json();
          setCostData(costs);
          localStorage.setItem('costData', JSON.stringify(costs));
        } else {
          setCostData(null);
          localStorage.removeItem('costData');
        }

        // --- Obrada letova ---
        if (flightsRes.ok) {
          const flights = await flightsRes.json();
          setFlightData(flights);
          localStorage.setItem('flightData', JSON.stringify(flights));
        } else {
          setFlightData([]);
          localStorage.setItem('flightData', JSON.stringify([]));
        }

        // --- Obrada hotela ---
        if (hotelsRes.ok) {
          const stats = await hotelsRes.json();
          setHotelStats(stats);
          localStorage.setItem('hotelStats', JSON.stringify(stats));
        } else {
          setHotelStats(null);
          localStorage.removeItem('hotelStats');
        }

        // --- Postavljanje aktivnog grada ---
        setActiveCity(city);
        localStorage.setItem('activeCity', city);

        /*
        console.log('🚀 SVI PODACI SPREMLJENI U LOCAL STORAGE:');
        const storagePreview = {
          activeCity: localStorage.getItem('activeCity'),
          weatherData: JSON.parse(localStorage.getItem('weatherData') || '[]'),
          costData: JSON.parse(localStorage.getItem('costData') || 'null'),
          flightData: JSON.parse(localStorage.getItem('flightData') || '[]'),
          hotelStats: JSON.parse(localStorage.getItem('hotelStats') || 'null'),
        };
        console.table(storagePreview);
        */

        // Očisti input polje
        setCity('');
      } catch (err) {
        console.error('Greška pri dohvaćanju podataka:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Input
      type="text"
      placeholder={loading ? 'Searching...' : 'Enter city and press Enter'}
      className="w-75 mb-4"
      value={city}
      onChange={(e: any) => setCity(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={loading}
    />
  );
}
