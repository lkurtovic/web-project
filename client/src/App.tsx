import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import SettingsDemo from './pages/Settings/SettingsDemo';
import { Login } from './pages/Login/Login';
import { Signup } from './pages/Signup/Signup';
import { Landing } from './pages/Landing/Landing';
import { Payment } from './pages/Payment/Payment';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/settings" element={<SettingsDemo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
