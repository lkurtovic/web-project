'use client';

import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { auth } from '@/firebase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlaneTakeoff, Calendar } from 'lucide-react';

// 1. Definiramo strukturu aerodroma za TypeScript
interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

type ContextType = {
  setSaveCallback: (cb: () => void) => void;
  setDirty: (d: boolean) => void;
};

export default function Flights() {
  const MAX_DISTANCE = 6;
  const { setSaveCallback, setDirty } = useOutletContext<ContextType>();

  // --- Range State ---
  const [range, setRange] = useState<[number, number]>([2, 6]);
  const [originalRange, setOriginalRange] = useState<[number, number]>([2, 6]);

  // --- Airport State ---
  const [allAirports, setAllAirports] = useState<Airport[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedIata, setSelectedIata] = useState<string>('');
  const [originalIata, setOriginalIata] = useState<string>('');

  const [loading, setLoading] = useState(true);

  // 1️⃣ Učitavanje podataka (Aerodromi + Korisnik)
  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        // A. Dohvati bazu aerodroma
        const airportRes = await fetch(
          'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json',
        );
        const airportData: Record<string, Airport> = await airportRes.json();
        const list = Object.values(airportData).filter(
          (a) => a.iata && a.iata.length === 3 && a.iata !== '0',
        );
        setAllAirports(list);

        // B. Dohvati korisničke postavke s backend-a
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/users/${user.uid}`,
        );
        const data = await res.json();

        // Postavi Range
        const start = data.search_start ?? 2;
        const duration = data.search_duration ?? 4;
        const serverRange: [number, number] = [start, start + duration];

        setRange(serverRange);
        setOriginalRange(serverRange);

        // Postavi IATA i detektiraj državu
        if (data.home_iata) {
          setSelectedIata(data.home_iata);
          setOriginalIata(data.home_iata);

          const currentAirport = list.find((a) => a.iata === data.home_iata);
          if (currentAirport) {
            setSelectedCountry(currentAirport.country);
          }
        }
      } catch (err) {
        console.error('Greška pri učitavanju postavki:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 2️⃣ Logika za filtriranje dropdown-a
  const countries = useMemo(() => {
    const countrySet = new Set(allAirports.map((a) => a.country));
    return Array.from(countrySet).sort();
  }, [allAirports]);

  const filteredAirports = useMemo(() => {
    if (!selectedCountry) return [];
    return allAirports
      .filter((a) => a.country === selectedCountry)
      .sort((a, b) => a.city.localeCompare(b.city));
  }, [selectedCountry, allAirports]);

  // 3️⃣ Detekcija promjena (Dirty State)
  useEffect(() => {
    const rangeChanged =
      range[0] !== originalRange[0] || range[1] !== originalRange[1];
    const iataChanged = selectedIata !== originalIata;

    setDirty(rangeChanged || iataChanged);
  }, [range, selectedIata, originalRange, originalIata, setDirty]);

  // 4️⃣ Funkcija za spremanje (šalje se u Outlet context)
  const savePreferences = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in');

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/${user.uid}/preferences`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            search_start: range[0],
            search_duration: range[1] - range[0],
            home_iata: selectedIata,
          }),
        },
      );

      if (!response.ok) throw new Error('Failed to update preferences');

      setOriginalRange([...range] as [number, number]);
      setOriginalIata(selectedIata);
      setDirty(false);
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message);
    }
  };

  useEffect(() => {
    setSaveCallback(() => savePreferences);
  }, [range, selectedIata, setSaveCallback]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-muted/50 p-4 rounded-lg">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex text-center items-center gap-2">
            Flight Settings
          </CardTitle>
          <CardDescription>
            Configure your departure airport and search timeframe.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* SEKCIJA: POLAZNI AERODROM */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <PlaneTakeoff size={18} />
              <span>DEPARTURE LOCATION</span>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="country-select">Home Country</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={(val) => {
                    setSelectedCountry(val);
                    setSelectedIata('');
                  }}
                >
                  <SelectTrigger id="country-select">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="airport-select">Departure City</Label>
                <Select
                  disabled={!selectedCountry}
                  value={selectedIata}
                  onValueChange={setSelectedIata}
                >
                  <SelectTrigger id="airport-select">
                    <SelectValue
                      placeholder={
                        selectedCountry ? 'Select City' : 'Choose country first'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAirports.map((a) => (
                      <SelectItem key={a.iata} value={a.iata}>
                        {a.city} ({a.iata})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <hr className="opacity-10" />

          {/* SEKCIJA: VREMENSKI RASPON */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Calendar size={18} />
              <span>SEARCH TIMEFRAME</span>
            </div>

            <div className="bg-muted p-3 rounded-md text-center">
              <p className="text-sm font-medium">
                Starts in <span className="text-primary">{range[0]}</span>{' '}
                months
              </p>
              <p className="text-xs text-muted-foreground">
                Duration: {range[1] - range[0]} months
              </p>
            </div>

            <div className="px-2 pt-4">
              <Slider
                value={range}
                onValueChange={(next) => {
                  let [left, right] = next;
                  if (right - left > MAX_DISTANCE) {
                    if (left !== range[0]) right = left + MAX_DISTANCE;
                    else left = right - MAX_DISTANCE;
                  }
                  setRange([left, right]);
                }}
                max={12}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
            <p className="text-[10px] text-muted-foreground italic text-center">
              * Maximum search window is 6 months.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
