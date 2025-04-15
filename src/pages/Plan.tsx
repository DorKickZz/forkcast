import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './Plan.css';

type Recipe = {
  id: string;
  title: string;
  url: string;
  meal_types: string[];
  is_vegetarian: boolean;
};

type Plan = {
  [day: string]: {
    [meal: string]: Recipe | null;
  };
};

export default function Plan() {
  const [plan, setPlan] = useState<Plan>({});
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<string[]>([]);
  const [meals, setMeals] = useState<string[]>([]);

  useEffect(() => {
    const storedDays = localStorage.getItem('forkcast_days');
    const storedMeals = localStorage.getItem('forkcast_meals');
    setDays(storedDays ? JSON.parse(storedDays) : []);
    setMeals(storedMeals ? JSON.parse(storedMeals) : []);
  }, []);

  useEffect(() => {
    if (days.length > 0 && meals.length > 0) {
      generatePlan();
    }
  }, [days, meals]);

  const generatePlan = async () => {
    setLoading(true);

    const { data: recipes, error } = await supabase.from('recipes').select('*');
    if (error) {
      alert('Fehler beim Laden der Rezepte');
      console.error(error);
      return;
    }

    const newPlan: Plan = {};
    for (const day of days) {
      newPlan[day] = {};
      for (const meal of meals) {
        const matching = recipes?.filter((r) => r.meal_types?.includes(meal)) || [];
        const random = matching[Math.floor(Math.random() * matching.length)] || null;
        newPlan[day][meal] = random;
      }
    }

    setPlan(newPlan);
    setLoading(false);
  };

  return (
    <div className="plan-page">
      <h2>Dein Wochenplan</h2>

      {loading ? (
        <p>Wird geladen...</p>
      ) : (
        <>
          <button onClick={generatePlan}>Plan neu generieren</button>
          <div className="plan-table">
            {days.map((day) => (
              <div key={day} className="plan-day">
                <h3>{day}</h3>
                <ul>
                  {meals.map((meal) => {
                    const recipe = plan[day]?.[meal];
                    return (
                      <li key={meal}>
                        <strong>{meal}:</strong>{' '}
                        {recipe ? (
                          <>
                            <a href={recipe.url} target="_blank" rel="noreferrer">
                              {recipe.title}
                            </a>{' '}
                            <em>({recipe.is_vegetarian ? 'Vegetarisch' : 'Mit Fleisch'})</em>
                          </>
                        ) : (
                          <em>Keine passende Idee gefunden</em>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
