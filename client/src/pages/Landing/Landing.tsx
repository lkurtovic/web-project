import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';

import { Instagram, Facebook, Twitter, Music2 } from 'lucide-react';
import {
  Pizza,
  Beer,
  Utensils,
  Hamburger,
  Beef,
  CloudRain,
  Thermometer,
  Sun,
  Wind,
  Hotel,
  Bed,
  Wallet,
  Star,
  Home as HomeIcon,
  Plane,
  PlaneTakeoff,
  Ticket,
  Globe,
  Cloud,
} from 'lucide-react';

// Interaktivne komponente
import Demo from '@/mine/HeatMapDemo';
import { TableDemo } from '@/mine/TableDemo';
import { ChartAreaInteractive } from '@/mine/LineChartDemo';

// JSON podaci
import foodData from './data/foodData.json';
import weatherData from './data/weatherData.json';
import flightData from './data/flightData.json';

import './Landing.css';

export function Landing() {
  const [ping, setPing] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * (32 - 14 + 1) + 14));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Navbar */}
      <div className="flex justify-between gap-3 p-4">
        <div>
          <Link to="#">
            <p className="font-extrabold">T-buddy</p>
          </Link>
        </div>
        <div className="flex justify-end gap-3">
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative text-center mt-20 mb-30 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-500/10 blur-[100px] rounded-full -z-10" />

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
              System Online // Latency: {ping}ms
            </span>
          </div>
        </div>

        <h1 className="text-8xl font-black mb-6 tracking-tighter uppercase">
          Welcome to T-buddy
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          Your personal tool for smart travelling. Compare prices, check weather
          analytics, and optimize your flights in one dashboard.
        </p>

        <div className="flex justify-center gap-4 mb-20">
          <Button
            size="lg"
            className="rounded-xl px-10 font-bold uppercase tracking-widest"
            asChild
          >
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl px-10 font-bold uppercase tracking-widest cursor-pointer transition"
            onClick={() => {
              document
                .getElementById('main')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn More
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 italic">
            Look into
          </p>
          <div className="flex gap-6 opacity-30 grayscale contrast-200">
            <span
              onClick={() =>
                document
                  .getElementById('weather')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="font-black text-sm cursor-pointer hover:text-white transition-colors"
            >
              WEATHER
            </span>
            <span
              onClick={() =>
                document
                  .getElementById('food')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="font-black text-sm cursor-pointer hover:text-white transition-colors"
            >
              FOOD&DRINKS
            </span>
            <span
              onClick={() =>
                document
                  .getElementById('flights')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="font-black text-sm cursor-pointer hover:text-white transition-colors"
            >
              FLIGHTS
            </span>
            <span
              onClick={() =>
                document
                  .getElementById('hotels')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="font-black text-sm cursor-pointer hover:text-white transition-colors"
            >
              HOTELS
            </span>
          </div>
        </div>
      </div>

      <div className="text-center my-20">
        <h1 className="text-6xl font-black tracking-tighter" id="main">
          ALL TRAVEL INFORMATION YOU NEED
        </h1>
      </div>

      {/* --- SEKCIJA 2: WEATHER --- */}
      <div
        id="weather"
        className="w-full py-4 overflow-hidden whitespace-nowrap border-y border/10 select-none"
      >
        <div className="flex animate-marquee-reverse gap-10 text-2xl  uppercase italic items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex gap-10 items-center">
              WEATHER <CloudRain size={24} /> TEMPERATURE{' '}
              <Thermometer size={24} /> RAIN <CloudRain size={24} /> FORECAST{' '}
              <Sun size={24} /> CLIMATE <Wind size={24} />
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center text-center mt-10 mb-40">
        <div className="max-w-4xl px-4 flex flex-col items-center w-full">
          <h2 className="text-4xl font-bold my-8 uppercase tracking-tight">
            Visiting your city when it's{' '}
            <span className="text-red-500">40°C</span>?
          </h2>
          <h5 className="text-2xl mb-4 font-bold uppercase italic">
            Maybe not the best idea!
          </h5>

          {/* ZAMJENA ZA SLIKU VREMENA */}
          <div className="w-full">
            <ChartAreaInteractive data={weatherData} />
          </div>

          <p className="text-gray-400 mt-8 text-xl max-w-2xl">
            Check historical weather patterns and precipitation to choose the
            perfect time for your visit.
          </p>
        </div>
      </div>

      {/* --- SEKCIJA 1: FOOD & DRINKS --- */}
      <div
        id="food"
        className="w-full py-4 overflow-hidden whitespace-nowrap border-y border/10 select-none"
      >
        <div className="flex animate-marquee gap-10 text-2xl  uppercase italic items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex gap-10 items-center">
              FOOD <Pizza size={24} /> DRINKS <Beer size={24} /> DINING{' '}
              <Utensils size={24} /> BURGERS <Hamburger size={24} /> STEAK{' '}
              <Beef size={24} />
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center text-center mt-10 mb-40">
        <div className="max-w-4xl px-4 flex flex-col items-center w-full">
          <h2 className="text-4xl font-bold my-8 uppercase tracking-tight">
            Don't forget about your food and drinks spending
          </h2>

          {/* ZAMJENA ZA SLIKU HRANE */}
          <div className="w-full p-6 rounded-xl border border/10 shadow-xl text-left">
            <TableDemo
              costData={foodData.costs}
              userPreferences={foodData.preferences}
            />
          </div>

          <p className="text-gray-400 mt-8 text-xl max-w-2xl">
            Detailed breakdown of local prices so you can manage your daily
            budget effortlessly.
          </p>
        </div>
      </div>

      {/* --- SEKCIJA 4: FLIGHTS --- */}
      <div
        id="flights"
        className="w-full py-4 overflow-hidden whitespace-nowrap border-y border/10 select-none"
      >
        <div className="flex animate-marquee-reverse gap-10 text-2xl  uppercase italic items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex gap-10 items-center">
              FLIGHTS <Plane size={24} /> AIRPORT <PlaneTakeoff size={24} />{' '}
              TICKETS <Ticket size={24} /> TRAVEL <Globe size={24} /> SKY{' '}
              <Cloud size={24} />
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center text-center mt-10 mb-20">
        <div className="max-w-4xl px-4 flex flex-col items-center w-full">
          <h2 className="text-4xl font-bold my-8 uppercase tracking-tight">
            Buy flights at the right time
          </h2>

          {/* ZAMJENA ZA SLIKU LETOVA */}

          <Demo flightData={flightData} />
          <p className="text-gray-400 mt-8 text-xl max-w-2xl">
            Track flight price volatility and find the cheapest dates using our
            advanced heatmap data.
          </p>
        </div>
      </div>
      {/* --- SEKCIJA 3: HOTELS --- */}
      <div
        id="hotels"
        className="w-full py-4 overflow-hidden whitespace-nowrap border-y border/10 select-none"
      >
        <div className="flex animate-marquee gap-10 text-2xl  uppercase italic items-center">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex gap-10 items-center">
              HOTELS <Hotel size={24} /> ACCOMMODATION <Bed size={24} /> PRICES{' '}
              <Wallet size={24} /> LUXURY <Star size={24} /> STAY{' '}
              <HomeIcon size={24} />
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center text-center mt-10 mb-40">
        <div className=" px-4 flex flex-col items-center w-full max-w-6xl">
          <h2 className="text-4xl font-bold my-8 uppercase tracking-tight">
            Interested in average prices?
          </h2>

          {/* OVDJE JOŠ NEMAŠ KOMPONENTU PA SAM OSTAVIO PLACEHOLDER ILI MOŽEŠ VRATITI STARU SLIKU */}
          {/* Kontejner koji je uvijek centriran, ima max širinu i automatski padding na mobitelu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-10 w-full max-w-6xl mx-auto px-4">
            {/* Najjeftiniji */}
            <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm flex flex-col items-center justify-center transition-all hover:border-green-500/50">
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1">
                Cheapest Stay
              </p>
              <p className="text-3xl font-bold text-green-500 tracking-tighter">
                $45.00
              </p>
            </div>

            {/* Prosjek */}
            <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm flex flex-col items-center justify-center transition-all hover:border-primary/50">
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1">
                Average Hotel
              </p>
              <p className="text-3xl font-bold text-foreground tracking-tighter">
                $142.50
              </p>
            </div>

            {/* Luksuz */}
            <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm flex flex-col items-center justify-center transition-all hover:border-red-500/50">
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1">
                Luxury Option
              </p>
              <p className="text-3xl font-bold text-red-500 tracking-tighter">
                $890.00
              </p>
            </div>

            {/* Broj hotela */}
            <div className="bg-card p-6 rounded-xl border border-border/40 shadow-sm flex flex-col items-center justify-center transition-all hover:border-blue-500/50">
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1">
                Hotels Found
              </p>
              <p className="text-3xl font-bold text-blue-500 tracking-tighter">
                128
              </p>
            </div>
          </div>

          <p className="text-gray-400 mt-8 text-xl max-w-2xl">
            Compare hotel costs with our min, max, and average price analytics
            for any destination.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-5 flex flex-col items-center gap-8 border-t border-white/5">
        <div className="flex gap-10">
          <a
            href="#"
            className="text-gray-500 hover:text-white transition-colors"
          >
            <Twitter size={24} strokeWidth={1.5} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-white transition-colors"
          >
            <Instagram size={24} strokeWidth={1.5} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-white transition-colors"
          >
            <Facebook size={24} strokeWidth={1.5} />
          </a>
          <a
            href="#"
            className="text-gray-500 hover:text-white transition-colors"
          >
            <Music2 size={24} strokeWidth={1.5} />
          </a>
        </div>
        <p className="text-[10px] uppercase tracking-[1em] text-gray-600 mb-3">
          © T-Buddy 2026
        </p>
      </footer>
    </div>
  );
}
