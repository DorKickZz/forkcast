// 📁 src/pages/Setup.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './Setup.css'

export default function Setup() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [isVegetarian, setIsVegetarian] = useState(false)
  const [mealTypes, setMealTypes] = useState<string[]>([])
  const [recipes, setRecipes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const mealOptions = ['Frühstück', 'Mittag', 'Abend']

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setRecipes(data)
    }
  }

  const fetchTitleFromUrl = async () => {
    if (!url) return
    setLoading(true)
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      const doc = new DOMParser().parseFromString(data.contents, 'text/html')
      const pageTitle = doc.querySelector('title')?.textContent || ''
      setTitle(pageTitle)
    } catch (e) {
      alert('Kein Titel gefunden – bitte manuell eingeben.')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Nicht eingeloggt!')
      return
    }

    const { error } = await supabase.from('recipes').insert({
      title,
      url,
      is_vegetarian: isVegetarian,
      meal_types: mealTypes,
      user_id: user.id
    })

    if (error) {
      alert('Fehler beim Speichern!')
    } else {
      setTitle('')
      setUrl('')
      setIsVegetarian(false)
      setMealTypes([])
      fetchRecipes()
    }
  }

  const toggleMeal = (meal: string) => {
    setMealTypes((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    )
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (!error) {
      setRecipes((prev) => prev.filter((r) => r.id !== id))
    } else {
      alert('Fehler beim Löschen.')
    }
  }

  return (
    <div className="setup-wrapper">
      <h2>🔗 Rezept hinzufügen</h2>
      <form className="recipe-form" onSubmit={handleSubmit}>
        <div className="row">
          <input
            type="text"
            placeholder="Rezept-Link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="button" onClick={fetchTitleFromUrl} disabled={loading}>
            {loading ? 'Lädt...' : 'Titel laden'}
          </button>
        </div>

        <input
          type="text"
          placeholder="Rezept-Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="checkbox-row">
          {mealOptions.map((meal) => (
            <label key={meal}>
              <input
                type="checkbox"
                value={meal}
                checked={mealTypes.includes(meal)}
                onChange={() => toggleMeal(meal)}
              />
              {meal}
            </label>
          ))}
        </div>

        <label className="veg-check">
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
          />
          Vegetarisch
        </label>

        <button type="submit">Speichern</button>
      </form>

      <h3>📚 Deine Rezepte</h3>
      <div className="recipe-list">
        {recipes.map((r) => (
          <div className="recipe-card" key={r.id}>
            <h4>{r.title}</h4>
            <p><a href={r.url} target="_blank" rel="noreferrer">Link öffnen</a></p>
            <small>{r.meal_types.join(', ')} – {r.is_vegetarian ? 'Vegetarisch' : 'Mit Fleisch'}</small>
            <button onClick={() => handleDelete(r.id)}>🗑️ Löschen</button>
          </div>
        ))}
      </div>
    </div>
  )
}
