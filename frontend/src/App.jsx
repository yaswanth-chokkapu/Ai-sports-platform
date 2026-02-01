import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Performance from "./pages/Performance";
import Injury from "./pages/Injury";
import VoiceCoachPage from "./pages/VoiceCoachPage";
import Contact from "./pages/Contact";

import { SessionProvider } from "./context/SessionContext"; // ✅ ADD THIS

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/injury" element={<Injury />} />
          <Route path="/coach" element={<VoiceCoachPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;


