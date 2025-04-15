// 📁 src/pages/Landing.tsx
import './Landing.css';
import { Link } from 'react-router-dom';
import hero from '../assets/hero.png';

export default function Landing() {
  return (
    <main className="landing-wrapper">
      <section className="landing-hero">
        <div className="hero-text">
          <h1>
            <span className="highlight">Plane smarter.</span><br />
            Iss besser.
          </h1>
          <p>
            Forkcast hilft dir, deine Woche stressfrei und lecker zu planen – ganz ohne Zettelwirtschaft.
          </p>
          <Link to="/login" className="cta-button">Jetzt starten</Link>
        </div>
        <div className="hero-image">
          <img src={hero} alt="Hero Illustration" />
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <span>🍽️</span>
          <h3>Rezepte verwalten</h3>
          <p>Speichere und kategorisiere deine Lieblingsrezepte in Sekunden.</p>
        </div>
        <div className="feature-card">
          <span>📅</span>
          <h3>Wochenplan generieren</h3>
          <p>Plane deine Woche automatisch – vegetarisch, vegan oder gemischt.</p>
        </div>
        <div className="feature-card">
          <span>⚡</span>
          <h3>Einfach & schnell</h3>
          <p>Minimalistisches Design, maximale Effizienz für deinen Alltag.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2025 Forkcast</p>
        <div>
          <Link to="/impressum">Impressum</Link> | <Link to="/datenschutz">Datenschutz</Link>
        </div>
      </footer>
    </main>
  );
}
