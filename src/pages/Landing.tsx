// 📁 src/pages/Landing.tsx
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-wrapper">
      <div className="hero-section">
        <img src={heroImage} alt="Forkcast Hero" className="hero-image" />

        <h1 className="headline">Plan smarter. Iss besser.</h1>
        <p className="subline">
          Forkcast hilft dir, deine Woche stressfrei und lecker zu planen.
        </p>
        <Link to="/setup" className="start-button">Jetzt starten</Link>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <span className="emoji">🧑‍🍳</span>
          <h3>Einfach</h3>
          <p>Rezepte mit nur wenigen Klicks speichern & auswählen.</p>
        </div>
        <div className="feature-card">
          <span className="emoji">📅</span>
          <h3>Automatisch</h3>
          <p>Plane deine Woche nach deinem Stil & deiner Ernährung.</p>
        </div>
        <div className="feature-card">
          <span className="emoji">🧠</span>
          <h3>Smart</h3>
          <p>Forkcast merkt sich deine Vorlieben – ganz automatisch.</p>
        </div>
      </div>
    </div>
  );
}
