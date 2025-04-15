// 📁 src/pages/Plan.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './Plan.css';

export default function Plan() {
  const [weeklyPlan, setWeeklyPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadExistingPlan = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('mealplans')
      .select('*, recipes(*)')
      .eq('user_id', user.id);

    if (!error && data.length > 0) {
      setWeeklyPlan(data.map((entry) => ({
        ...entry,
        recipes: entry.recipes,
      })));
    }
  };

  const generatePlan = async () => {
    setLoading(true);

    const selectedDays = JSON.parse(localStorage.getItem('forkcast_days') || '[]');
    const selectedMeals = JSON.parse(localStorage.getItem('forkcast_meals') || '[]');

    console.log("Tage:", selectedDays);
    console.log("Mahlzeiten:", selectedMeals);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('mealplans').delete().eq('user_id', user.id);

    const { data: allRecipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id);

    console.log("Alle Rezepte:", allRecipes);

    if (error || !allRecipes) return;

    const planEntries = [];

    for (const day of selectedDays) {
      for (const meal of selectedMeals) {
        const matching = allRecipes.filter((r) => r.meal_types?.includes(meal));
        if (matching.length === 0) continue;

        const recipe = matching[Math.floor(Math.random() * matching.length)];

        planEntries.push({
          user_id: user.id,
          day,
          meal_type: meal,
          recipe_id: recipe.id,
          recipes: recipe,
        });
      }
    }

    console.log("Plan wird gespeichert:", planEntries);

    if (planEntries.length > 0) {
      await supabase.from('mealplans').insert(
        planEntries.map(({ recipes, ...entry }) => entry)
      );

      const { data: newPlan, error: insertError } = await supabase
        .from('mealplans')
        .select('*, recipes(*)')
        .eq('user_id', user.id);

      if (insertError) {
        console.error("Fehler beim Abrufen nach dem Einfügen:", insertError);
      } else {
        setWeeklyPlan(newPlan);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    loadExistingPlan();
  }, []);

  return (
    <div className="plan-container">
      <h2 className="plan-title">Dein Plan</h2>

      <button onClick={generatePlan} disabled={loading} style={{ marginBottom: '2rem' }}>
        {loading ? 'Wird generiert...' : 'Plan generieren'}
      </button>

      <div className="plan-grid">
        {weeklyPlan.map((entry, index) => (
          <div key={index} className="plan-card">
            <h3>{entry.day} – {entry.meal_type}</h3>
            <p>{entry.recipes?.title}</p>
            {entry.recipes?.url && (
              <a href={entry.recipes.url} target="_blank" rel="noopener noreferrer">
                Zum Rezept
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}