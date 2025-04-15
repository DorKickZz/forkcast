// 📁 src/pages/Setup.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./Setup.css";

export default function Setup() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [defaultVeggie, setDefaultVeggie] = useState(false);

  const fetchDefaultVeggie = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("is_vegetarian")
      .eq("id", user.id)
      .single();

    if (!error && data?.is_vegetarian !== undefined) {
      setIsVegetarian(data.is_vegetarian);
      setDefaultVeggie(data.is_vegetarian);
    }
  };

  const fetchRecipes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRecipes(data);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMealTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const fetchTitle = async () => {
    if (!url) return alert("Bitte gib einen Link ein.");
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      const doc = new DOMParser().parseFromString(data.contents, "text/html");
      const fetchedTitle = doc.querySelector("title")?.textContent || "";
      setTitle(fetchedTitle);
    } catch {
      alert("Titel konnte nicht geladen werden.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("Fehler beim Abrufen des Benutzers.");
      return;
    }

    const { error } = await supabase.from("recipes").insert({
      title,
      url,
      is_vegetarian: isVegetarian,
      meal_types: mealTypes,
      user_id: user.id,
    });

    if (error) {
      alert("Fehler beim Speichern des Rezepts.");
    } else {
      alert("Rezept gespeichert!");
      setTitle("");
      setUrl("");
      setIsVegetarian(defaultVeggie);
      setMealTypes([]);
      fetchRecipes();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (!error) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Fehler beim Löschen.");
    }
  };

  useEffect(() => {
    fetchDefaultVeggie();
    fetchRecipes();
  }, []);

  return (
    <div className="setup-container">
      <h2>Neues Rezept hinzufügen</h2>
      <form onSubmit={handleSubmit}>
        <label>Rezept-Link:</label>
        <div className="link-input">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            required
          />
          <button type="button" onClick={fetchTitle}>Titel laden</button>
        </div>

        <label>Titel:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Mahlzeiten:</label>
        <div className="checkbox-group">
          {["Frühstück", "Mittag", "Abend"].map((m) => (
            <label key={m}>
              <input
                type="checkbox"
                value={m}
                checked={mealTypes.includes(m)}
                onChange={handleCheckboxChange}
              />
              {m}
            </label>
          ))}
        </div>

        <label>
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
          />
          Vegetarisch
        </label>

        <button type="submit">Rezept speichern</button>
      </form>

      <h3>Deine Rezepte</h3>
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <strong>{recipe.title}</strong><br />
            <a href={recipe.url} target="_blank" rel="noopener noreferrer">
              {recipe.url}
            </a><br />
            <em>
              {recipe.is_vegetarian ? "Vegetarisch" : "Nicht vegetarisch"} –{" "}
              {recipe.meal_types?.join(", ")}
            </em><br />
            <button onClick={() => handleDelete(recipe.id)}>Löschen</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
