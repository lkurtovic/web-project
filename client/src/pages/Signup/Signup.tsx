import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Input from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Google user:', user);
  } catch (error: any) {
    console.error('Google sign-in error:', error.message);
  }
};

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1️⃣ Kreiraj korisnika
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2️⃣ Pošalji email za verifikaciju
      await sendEmailVerification(user);

      // 3️⃣ Odmah logout da korisnik ne bude automatski logiran
      await auth.signOut();

      // 4️⃣ Obavijesti korisnika i redirect na login
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
      <div className="flex justify-start gap-3 mb-20">
        <Link to="/">
          <p className="font-extrabold">T-buddy</p>
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
                <Label className="mb-2" htmlFor="password">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>

            <CardFooter className="flex-col gap-2 mt-5">
              <Button type="submit" className="w-full cursor-pointer">
                Sign Up
              </Button>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleGoogleSignIn}
              >
                Sign Up with Google
              </Button>
              <p className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 mt-5">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
