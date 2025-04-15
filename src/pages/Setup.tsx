import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './Setup.css';

export default function Setup() {
  const [mode, setMode] = useState<'link' | 'manual'>('link');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    const diet = localStorage.getItem('forkcast_diet');
    setIsVegetarian(diet === 'vegetarisch');
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const { data, error } = await supabase.from('recipes').select('*').order('created_at', { ascending: false });
    if (!error && data) setRecipes(data);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMealTypes((prev) => prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]);
  };

  const handleAutoFill = async () => {
    if (!url) return alert('Bitte zuerst einen Link eingeben');
    try {
      const response = await fetch(`/api/title?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.title) setTitle(data.title);
      else alert('Kein Titel gefunden');
    } catch {
      alert('Fehler beim Abrufen');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalTitle = title || 'Unbenanntes Rezept';

    const { error } = await supabase.from('recipes').insert({
      title: finalTitle,
      url: mode === 'link' ? url : '',
      is_vegetarian: isVegetarian,
      meal_types: mealTypes,
    });

    if (error) return alert('Fehler beim Speichern des Rezepts');

    setTitle('');
    setUrl('');
    setIsVegetarian(localStorage.getItem('forkcast_diet') === 'vegetarisch');
    setMealTypes([]);
    fetchRecipes();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (!error) setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="setup-container">
      <h2>Rezept hinzufügen</h2>
      <div className="toggle-mode">
        <button className={mode === 'link' ? 'active' : ''} onClick={() => setMode('link')}>Per Link</button>
        <button className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>Eigenes Rezept</button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'link' && (
          <>
            <label>Link zum Rezept:</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
            />
            <button type="button" onClick={handleAutoFill}>Titel automatisch aus Link holen</button>

            <label>Titel:</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Spaghetti Bolognese"
            />
          </>
        )}

        {mode === 'manual' && (
          <>
            <label>Titel des Rezepts:</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </>
        )}

        <label>Mahlzeiten-Typ(en):</label>
        <div className="checkbox-group">
          {['Frühstück', 'Mittag', 'Abend'].map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                checked={mealTypes.includes(type)}
                onChange={handleCheckboxChange}
              />
              {type}
            </label>
          ))}
        </div>

        <label>
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
          />{' '}
          Vegetarisch
        </label>

        <button type="submit">Rezept speichern</button>
      </form>

      <h3>Deine Rezeptbibliothek</h3>
      <ul className="recipe-list">
        {recipes.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong><br />
            {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer">Zum Rezept</a>}<br />
            <em>{r.is_vegetarian ? 'Vegetarisch' : 'Mit Fleisch'} – {r.meal_types?.join(', ')}</em><br />
            <button onClick={() => handleDelete(r.id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
