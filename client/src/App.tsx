import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth'; // <--- type-only import
import { auth } from '@/firebase';

import Page from '@/pages/Settings/page';
import FoodWaterTable from '@/pages/Settings/FoodWater/FoodWaterTable';
import General from '@/pages/Settings/General/General';
import Interests from './pages/Settings/Interests/Interests';

import Home from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { Signup } from './pages/Signup/Signup';
import { Landing } from './pages/Landing/Landing';
import { Payment } from './pages/Payment/Payment';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // čekamo Firebase init

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // auth state dohvaćen
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // opcionalno loader dok auth state dolazi

  return (
    <BrowserRouter>
      <Routes>
        {/* Landing je javna */}
        <Route path="/" element={<Landing />} />

        {/* Login/Signup samo za ne-logirane */}
        <Route
          path="/login"
          element={
            !user ? (
              <Login />
            ) : !user.emailVerified ? (
              <Login />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/home" replace />}
        />

        {/* Zaštićene rute */}
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={user ? <Page /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/payment"
          element={user ? <Payment /> : <Navigate to="/login" replace />}
        />

        {/* Fallback za nepostojeće rute */}
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route
          path="/settings"
          element={user ? <Page /> : <Navigate to="/login" replace />}
        >
          <Route index element={<General />} />
          <Route path="food-water" element={<FoodWaterTable />} />
          <Route path="interests" element={<Interests />} />
          <Route path="general" element={<General />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
