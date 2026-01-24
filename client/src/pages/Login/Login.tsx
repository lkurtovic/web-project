import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useNavigate, Link } from 'react-router-dom';
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
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
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function Login() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      console.log('Google user:', user);
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
          <p className="font-extrabold">T-buddy</p>
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
                <Label className="mb-2">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="mb-2">Password</Label>
                <Input
                  type="password"
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
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) =>
                    setRememberMe(!!checked)
                  }
                />
                <Label>Remember me</Label>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn} // dodano
              >
                Login with Google
              </Button>
              <Label className="mt-5">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </Label>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
