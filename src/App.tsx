import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Setup from './pages/Setup';
import Plan from './pages/Plan';
import PlanSetup from './pages/PlanSetup';
import Datenschutz from './pages/Datenschutz';
import Impressum from './pages/Impressum';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Geschützter Bereich mit Header & Layout */}
        <Route element={<Layout />}>
          <Route path="/setup" element={<Setup />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/setup" element={<PlanSetup />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
