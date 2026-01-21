import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import SettingsDemo from "./pages/Settings/SettingsDemo"

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<SettingsDemo />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
