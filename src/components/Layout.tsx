// 📁 src/components/Layout.tsx
import { Link, Outlet } from 'react-router-dom';
import { FaHome, FaClipboardList, FaPlusCircle } from 'react-icons/fa';
import './Layout.css';
import logo from '../assets/logo.png';

export default function Layout() {
  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Forkcast Logo" />
          
        </div>
        <nav className="nav-links">
          <Link to="/" className="nav-item">
            <FaHome /> Start
          </Link>
          <Link to="/setup" className="nav-item">
            <FaPlusCircle /> Rezepte
          </Link>
          <Link to="/setup-plan" className="nav-item">
            <FaClipboardList /> Planen
          </Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}