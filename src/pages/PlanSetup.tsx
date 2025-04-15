// 📁 src/pages/PlanSetup.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlanSetup.css';
import { FaCalendarDay, FaUtensils, FaSave } from 'react-icons/fa';

export default function PlanSetup() {
  const [days, setDays] = useState<string[]>([]);
  const [meals, setMeals] = useState<string[]>([]);
  const navigate = useNavigate();

  const weekdays = [
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
    'Sonntag',
  ];

  const mealOptions = ['Frühstück', 'Mittag', 'Abend'];

  const toggle = (value: string, state: string[], setState: (val: string[]) => void) => {
    setState(state.includes(value) ? state.filter((v) => v !== value) : [...state, value]);
  };

  const handleSave = () => {
    localStorage.setItem('forkcast_days', JSON.stringify(days));
    localStorage.setItem('forkcast_meals', JSON.stringify(meals));
    navigate('/plan');
  };

  return (
    <div className="plan-setup-container">
      <header className="plan-header">
        <img src="/logo.png" alt="Forkcast Logo" className="plan-logo" />
        <h1 className="plan-title">Forkcast Planer</h1>
      </header>

      <section className="section">
        <h3><FaCalendarDay /> Wochentage auswählen</h3>
        <div className="options">
          {weekdays.map((day) => (
            <label key={day} className="checkbox-tile">
              <input
                type="checkbox"
                value={day}
                checked={days.includes(day)}
                onChange={() => toggle(day, days, setDays)}
              />
              <span>{day}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="section">
        <h3><FaUtensils /> Mahlzeiten pro Tag</h3>
        <div className="options">
          {mealOptions.map((meal) => (
            <label key={meal} className="checkbox-tile">
              <input
                type="checkbox"
                value={meal}
                checked={meals.includes(meal)}
                onChange={() => toggle(meal, meals, setMeals)}
              />
              <span>{meal}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="actions">
        <button onClick={handleSave} disabled={days.length === 0 || meals.length === 0}>
          <FaSave style={{ marginRight: '0.5rem' }} /> Plan speichern & starten
        </button>
      </div>
    </div>
  );
}