// 📁 src/pages/Onboarding.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Onboarding.css';

export default function Onboarding() {
  const [selection, setSelection] = useState('');
  const navigate = useNavigate();

  // 🧠 Onboarding nur einmal zeigen
  useEffect(() => {
    const onboarded = localStorage.getItem('forkcast_onboarded');
    if (onboarded === 'true') {
      navigate('/setup');
    }
  }, [navigate]);

  // Auswahl speichern und weiter
  const handleSelect = (value: string) => {
    setSelection(value);
    localStorage.setItem('forkcast_diet', value);
    localStorage.setItem('forkcast_onboarded', 'true');
    setTimeout(() => navigate('/setup'), 400);
  };

  return (
    <div className="onboarding-wrapper">
      <div className="onboarding-box">
        <h2>Wie möchtest du Forkcast nutzen?</h2>
        <p className="sub">Diese Auswahl legt fest, ob Rezepte standardmäßig als vegetarisch gelten.</p>

        <div className="option-group">
          <button
            className={`diet-button ${selection === 'vegetarisch' ? 'selected' : ''}`}
            onClick={() => handleSelect('vegetarisch')}
          >
            Vegetarisch / Vegan
          </button>
          <button
            className={`diet-button ${selection === 'allesesser' ? 'selected' : ''}`}
            onClick={() => handleSelect('allesesser')}
          >
            Allesesser (auch Fleisch)
          </button>
        </div>

        <footer className="onboarding-footer">
          <small>
            © 2025 Forkcast – <a href="/impressum">Impressum</a> | <a href="/datenschutz">Datenschutz</a>
          </small>
        </footer>
      </div>
    </div>
  );
}
