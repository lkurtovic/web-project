import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
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
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { API_ENDPOINTS } from '@/lib/api';

export function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setError('');

    if (!email) {
      setError('Please enter your email to reset password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent. Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadUserSettings = async (uid: string) => {
    // Koristimo USER_BY_ID funkciju iz api.ts
    const res = await fetch(API_ENDPOINTS.USER_BY_ID(uid));

    if (!res.ok) throw new Error('Failed to load user settings');
    return res.json();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // postavi persistence prije logina
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence,
      );

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        await auth.signOut(); // odmah logout
        return;
      }

      // 🔥 POVUCI USER SETTINGS
      const settings = await loadUserSettings(user.uid);

      // 🔥 SPREMI U LOCAL STORAGE
      localStorage.setItem('user_settings', JSON.stringify(settings));

      localStorage.setItem(
        'flight_range',
        JSON.stringify([
          settings.search_start,
          settings.search_start + settings.search_duration,
        ]),
      );
      navigate('/home'); // email verified → login uspješan
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const settings = await loadUserSettings(user.uid);
      localStorage.setItem('user_settings', JSON.stringify(settings));
      console.log('Google user:', user);
      localStorage.setItem(
        'flight_range',
        JSON.stringify([
          settings.search_start,
          settings.search_start + settings.search_duration,
        ]),
      );
      navigate('/home'); // preusmjeri na home nakon Google login-a
    } catch (err: any) {
      console.error('Google sign-in error:', err.message);
      setError(err.message); // opcionalno prikaži error
    }
  };

  return (
    <div>
      <div className="flex justify-start gap-3 mb-20">
        <Link to="/">
          <p className="font-extrabold text-xl">Putify</p>
        </Link>
      </div>

      <div className="flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              To login fill up information below
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="flex flex-col gap-6">
              <div>
                <Label className="mb-2" htmlFor="email">
                  Email
                </Label>
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

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="" htmlFor="password">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>

            <CardContent className="my-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  className="cursor-pointer"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) =>
                    setRememberMe(!!checked)
                  }
                />
                <Label htmlFor="rememberMe">Remember me</Label>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full cursor-pointer">
                Login
              </Button>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleGoogleSignIn} // dodano
              >
                Login with Google
              </Button>
              <p className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 mt-5">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
