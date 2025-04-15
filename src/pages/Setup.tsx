import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './Setup.css';

export default function Setup() {
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
      url,
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
    <div className="setup-container">
      <h2>Neues Rezept hinzufügen</h2>
      <form onSubmit={handleSubmit}>
        <label>Titel:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Link zum Rezept:</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} required />

        <label>Mahlzeiten-Typ(en):</label>
        <div>
          <label>
            <input
              type="checkbox"
              value="Frühstück"
              checked={mealTypes.includes("Frühstück")}
              onChange={handleCheckboxChange}
            />
            Frühstück
          </label>
          <label>
            <input
              type="checkbox"
              value="Mittag"
              checked={mealTypes.includes("Mittag")}
              onChange={handleCheckboxChange}
            />
            Mittagessen
          </label>
          <label>
            <input
              type="checkbox"
              value="Abend"
              checked={mealTypes.includes("Abend")}
              onChange={handleCheckboxChange}
            />
            Abendessen
          </label>
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
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id} style={{ marginBottom: '1rem' }}>
            <strong>{recipe.title}</strong><br />
            <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a><br />
            <em>{recipe.is_vegetarian ? 'Vegetarisch' : 'Nicht vegetarisch'} – {recipe.meal_types?.join(', ')}</em><br />
            <button onClick={() => handleDelete(recipe.id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
