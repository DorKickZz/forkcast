// 📁 src/components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'
import './Sidebar.css'

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <aside className="sidebar">
      <img src={logo} alt="Forkcast Logo" className="logo" />

      <nav className="nav-links">
        <NavLink to="/setup" className="nav-item">Rezepte</NavLink>
        <NavLink to="/plan-setup" className="nav-item">Plan erstellen</NavLink>
        <NavLink to="/plan" className="nav-item">Wochenplan</NavLink>
        <NavLink to="/impressum" className="nav-item">Impressum</NavLink>
        <NavLink to="/datenschutz" className="nav-item">Datenschutz</NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </aside>
  )
}
