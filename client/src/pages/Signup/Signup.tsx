'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Uvoz ikona za lozinku
import { Eye, EyeOff } from 'lucide-react';

export function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State za vidljivost lozinke
  const [error, setError] = useState('');

  // --- Airport State ---
  const [allAirports, setAllAirports] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedIata, setSelectedIata] = useState<string>('');

  const navigate = useNavigate();

  // 1. Dohvat baze aerodroma
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const list = Object.values(data).filter(
          (a: any) => a.iata && a.iata.length === 3 && a.iata !== '0',
        );
        setAllAirports(list);
      });
  }, []);

  // 2. Unikatne države
  const countries = useMemo(() => {
    const set = new Set(allAirports.map((a) => a.country));
    return Array.from(set).sort();
  }, [allAirports]);

  // 3. Filtrirani aerodromi
  const filteredAirports = useMemo(() => {
    if (!selectedCountry) return [];
    return allAirports
      .filter((a) => a.country === selectedCountry)
      .sort((a, b) => a.city.localeCompare(b.city));
  }, [selectedCountry, allAirports]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      if (!selectedIata) {
        setError('Please select departure city before Google Sign-In');
        return;
      }
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          username: user.displayName,
          email: user.email,
          home_iata: selectedIata,
        }),
      });
      navigate('/');
    } catch (error: any) {
      console.error('Google sign-in error:', error.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIata) {
      setError('Please select departure city');
      return;
    }
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: username });
      await sendEmailVerification(user);

      await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          username: username,
          email: user.email,
          home_iata: selectedIata,
        }),
      });

      await auth.signOut();
      alert(
        'Verification email sent! Please check your email before logging in.',
      );
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex justify-start gap-3 mb-10">
        <Link to="/">
          <p className="font-extrabold text-xl">T-buddy</p>
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              To sign up enter information below
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSignup}>
            <CardContent className="flex flex-col gap-6">
              {/* Username Polje */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="full-name-display"
                  type="text"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Email Polje */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Polje s OKOM */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </button>
                </div>
              </div>

              {/* --- DROPDOWNS --- */}
              <div className="space-y-2">
                <Label htmlFor="country-select">Departure Country</Label>
                <Select
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

              <div className="space-y-2">
                <Label htmlFor="city-select">Departure City</Label>
                <Select
                  onValueChange={setSelectedIata}
                  disabled={!selectedCountry}
                  value={selectedIata}
                >
                  <SelectTrigger id="city-select">
                    <SelectValue
                      placeholder={
                        selectedCountry ? 'Select City' : 'Select country first'
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

              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>

            <CardFooter className="flex-col gap-2 mt-5">
              <Button type="submit" className="w-full cursor-pointer">
                Sign Up
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleGoogleSignIn}
              >
                Sign Up with Google
              </Button>
              <p className="flex items-center gap-2 text-sm leading-none font-medium mt-5">
                Already have an account?{' '}
                <Link to="/login" className="underline">
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
