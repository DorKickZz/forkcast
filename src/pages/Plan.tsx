// 📁 src/pages/Plan.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./Plan.css";

const daysOfWeek = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

const mealTypes = ["Frühstück", "Mittag", "Abend"];

export default function Plan() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [onlyVegetarian, setOnlyVegetarian] = useState(false);
  const [plan, setPlan] = useState<{ [day: string]: { [meal: string]: any } }>({});

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", user.id);

    if (data) setRecipes(data);
  };

  const toggleSelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    setList(list.includes(item) ? list.filter((v) => v !== item) : [...list, item]);
  };

  const generatePlan = () => {
    const filtered = recipes.filter((r) =>
      (!onlyVegetarian || r.is_vegetarian)
    );

    const newPlan: { [day: string]: { [meal: string]: any } } = {};

    selectedDays.forEach((day) => {
      newPlan[day] = {};
      selectedMeals.forEach((meal) => {
        const options = filtered.filter((r) => r.meal_types?.includes(meal));
        const recipe = options[Math.floor(Math.random() * options.length)];
        newPlan[day][meal] = recipe || null;
      });
    });

    setPlan(newPlan);
  };

  return (
    <div className="plan-page">
      <h2>Wochenplan erstellen</h2>

      <section className="plan-form">
        <label>Wochentage:</label>
        <div className="checkbox-grid">
          {daysOfWeek.map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={() => toggleSelection(day, selectedDays, setSelectedDays)}
              />
              {day}
            </label>
          ))}
        </div>

        <label>Mahlzeiten:</label>
        <div className="checkbox-grid">
          {mealTypes.map((meal) => (
            <label key={meal}>
              <input
                type="checkbox"
                checked={selectedMeals.includes(meal)}
                onChange={() => toggleSelection(meal, selectedMeals, setSelectedMeals)}
              />
              {meal}
            </label>
          ))}
        </div>

        <label>
          <input
            type="checkbox"
            checked={onlyVegetarian}
            onChange={() => setOnlyVegetarian(!onlyVegetarian)}
          />
          Nur vegetarische Rezepte
        </label>

        <button onClick={generatePlan} disabled={selectedDays.length === 0 || selectedMeals.length === 0}>
          Plan generieren
        </button>
      </section>

      {Object.keys(plan).length > 0 && (
        <section className="plan-result">
          <h3>Dein Wochenplan</h3>
          <div className="plan-grid">
            {selectedDays.map((day) => (
              <div key={day} className="plan-day">
                <h4>{day}</h4>
                {selectedMeals.map((meal) => {
                  const recipe = plan[day]?.[meal];
                  return (
                    <div key={meal} className="plan-meal">
                      <strong>{meal}:</strong>{" "}
                      {recipe ? (
                        <a href={recipe.url} target="_blank" rel="noreferrer">
                          {recipe.title}
                        </a>
                      ) : (
                        <em>Kein passendes Rezept</em>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
