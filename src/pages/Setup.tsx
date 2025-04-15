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
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setRecipes(data);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMealTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleAutoFill = async () => {
    if (!url) return alert('Bitte gib einen Link ein');

    try {
      const response = await fetch(`http://localhost:3001/title?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.title) {
        setTitle(data.title);
      } else {
        alert('Kein Titel gefunden.');
      }
    } catch (error) {
      alert('Fehler beim Laden des Titels.');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || mealTypes.length === 0) {
      alert('Bitte gib einen Titel und mindestens eine Mahlzeit an.');
      return;
    }

    const { error } = await supabase.from('recipes').insert({
      title,
      url: mode === 'link' ? url : '',
      is_vegetarian: isVegetarian,
      meal_types: mealTypes,
    });

    if (error) {
      alert('Fehler beim Speichern.');
      console.error(error);
      return;
    }

    // Reset
    setTitle('');
    setUrl('');
    setMealTypes([]);
    setIsVegetarian(localStorage.getItem('forkcast_diet') === 'vegetarisch');
    fetchRecipes();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (!error) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="setup-container">
      <h2>Rezept hinzufügen</h2>

      <div className="toggle-mode">
        <button className={mode === 'link' ? 'active' : ''} onClick={() => setMode('link')}>
          Rezept-Link
        </button>
        <button className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>
          Eigenes Rezept
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === 'link' && (
          <>
            <label>Rezept-Link:</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
            />
            <button type="button" onClick={handleAutoFill}>
              Titel automatisch laden
            </button>
            <label>Titel:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel"
              required
            />
          </>
        )}

        {mode === 'manual' && (
          <>
            <label>Titel:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z. B. Veggie-Bowl"
              required
            />
          </>
        )}

        <label>Mahlzeiten-Typ(en):</label>
        <div className="checkbox-group">
          {['Frühstück', 'Mittag', 'Abend'].map((meal) => (
            <label key={meal}>
              <input
                type="checkbox"
                value={meal}
                checked={mealTypes.includes(meal)}
                onChange={handleCheckboxChange}
              />
              {meal}
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

      <h3>Deine Rezepte</h3>
      <ul className="recipe-list">
        {recipes.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong><br />
            {r.url && (
              <a href={r.url} target="_blank" rel="noreferrer">
                Link
              </a>
            )}
            <br />
            <em>
              {r.is_vegetarian ? 'Vegetarisch' : 'Mit Fleisch'} – {r.meal_types?.join(', ')}
            </em><br />
            <button onClick={() => handleDelete(r.id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
