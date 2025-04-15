// 📄 src/pages/Setup.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './Setup.css';

export default function Setup() {
  const [isCustom, setIsCustom] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMealTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const fetchTitleFromUrl = async () => {
    try {
      const response = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      const doc = new DOMParser().parseFromString(data.contents, 'text/html');
      const pageTitle = doc.querySelector('title')?.textContent;
      if (pageTitle) {
        setTitle(pageTitle);
      } else {
        alert('Kein Titel gefunden. Bitte manuell eingeben.');
      }
    } catch {
      alert('Fehler beim Laden des Titels');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      alert('Fehler beim Abrufen des Benutzers');
      return;
    }

    const { error } = await supabase.from('recipes').insert({
      title,
      url: isCustom ? '' : url,
      is_vegetarian: isVegetarian,
      meal_types: mealTypes,
      user_id: user.id,
    });

    if (error) {
      alert('Fehler beim Speichern des Rezepts');
    } else {
      alert('Rezept gespeichert!');
      setTitle('');
      setUrl('');
      setIsVegetarian(false);
      setMealTypes([]);
      setIsCustom(false);
      fetchRecipes();
    }
  };

  const fetchRecipes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRecipes(data);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (!error) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert('Fehler beim Löschen');
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="setup-wrapper">
      <div className="setup-container">
        <h2>Rezept hinzufügen</h2>

        <div className="toggle-buttons">
          <button
            className={!isCustom ? 'active' : ''}
            onClick={() => setIsCustom(false)}
          >
            Rezept-Link
          </button>
          <button
            className={isCustom ? 'active' : ''}
            onClick={() => setIsCustom(true)}
          >
            Eigenes Rezept
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isCustom && (
            <>
              <label>Rezept-Link:</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={fetchTitleFromUrl}
                className="secondary"
              >
                Titel automatisch laden
              </button>
            </>
          )}

          <label>Titel:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Mahlzeiten-Typ(en):</label>
          <div className="checkboxes">
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
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <strong>{recipe.title}</strong>{' '}
              {recipe.url && (
                <>
                  –{' '}
                  <a
                    href={recipe.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </a>
                </>
              )}
              <br />
              <em>
                {recipe.is_vegetarian ? 'Vegetarisch' : 'Mit Fleisch'} –{' '}
                {recipe.meal_types?.join(', ')}
              </em>
              <br />
              <button onClick={() => handleDelete(recipe.id)}>Löschen</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
