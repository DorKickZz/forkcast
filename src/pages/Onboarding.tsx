import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Aktuellen User abrufen
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(userError);
      setLoading(false);
      return;
    }

    // Profil speichern oder updaten
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      is_vegetarian: isVegetarian,
    });

    setLoading(false);

    if (!error) {
      navigate('/setup'); // Weiter zur Rezeptverwaltung
    } else {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
      <h2>Was trifft auf dich zu?</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
          />{' '}
          Ich möchte bevorzugt vegetarische Rezepte verwenden
        </label>
        <br />
        <button type="submit" disabled={loading}>
          Weiter
        </button>
      </form>
    </div>
  );
}
