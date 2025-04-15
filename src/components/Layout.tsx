// 📁 src/components/Layout.tsx

import { Link, Outlet } from 'react-router-dom';
import './Layout.css';
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Forkcast Logo" />
        </div>

        <nav className="nav-links">
          <Link className="nav-item" to="/setup">Rezepte</Link>
          <Link className="nav-item" to="/plan-setup">Plan erstellen</Link>
          <Link className="nav-item" to="/plan">Wochenplan</Link>
          <Link className="nav-item" to="/impressum">Impressum</Link>
          <Link className="nav-item" to="/datenschutz">Datenschutz</Link>
          <button onClick={handleLogout} className="nav-item">Logout</button>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
        <footer className="app-footer">
          <p>
            &copy; {new Date().getFullYear()} Forkcast |
            <Link to="/impressum"> Impressum</Link> |
            <Link to="/datenschutz"> Datenschutz</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
