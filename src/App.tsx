// 📁 src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Setup from './pages/Setup';
import PlanSetup from './pages/PlanSetup';
import Plan from './pages/Plan';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page ohne Layout */}
        <Route path="/" element={<Landing />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Seiten mit Sidebar & Footer */}
        <Route
          path="/setup"
          element={
            <Layout>
              <Setup />
            </Layout>
          }
        />
        <Route
          path="/plan-setup"
          element={
            <Layout>
              <PlanSetup />
            </Layout>
          }
        />
        <Route
          path="/plan"
          element={
            <Layout>
              <Plan />
            </Layout>
          }
        />
        <Route
          path="/impressum"
          element={
            <Layout>
              <Impressum />
            </Layout>
          }
        />
        <Route
          path="/datenschutz"
          element={
            <Layout>
              <Datenschutz />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
