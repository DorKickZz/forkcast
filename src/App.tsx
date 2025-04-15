// 📁 src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import AuthLayout from './pages/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';

import Setup from './pages/Setup';
import PlanSetup from './pages/PlanSetup';
import Plan from './pages/Plan';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';

function App() {
  return (
    <Router>
      <Routes>

        {/* Seiten ohne Sidebar */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        {/* Seiten mit Sidebar + Schutz */}
        <Route element={<Layout />}>
          <Route
            path="/setup"
            element={
              <ProtectedRoute>
                <Setup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan-setup"
            element={
              <ProtectedRoute>
                <PlanSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plan"
            element={
              <ProtectedRoute>
                <Plan />
              </ProtectedRoute>
            }
          />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
