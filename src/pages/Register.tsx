// 📁 src/pages/Register.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import './Auth.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isVegetarian, setIsVegetarian] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.signUp({

      email,
      password,
      options: {
        data: {
          prefers_veg: isVegetarian,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="auth-container">
      <h2>Registrieren</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="veg-toggle">
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={() => setIsVegetarian(!isVegetarian)}
          />
          Standardmäßig vegetarisch?
        </label>

        <button type="submit">Konto erstellen</button>
        {error && <p className="error">{error}</p>}
      </form>

      <p className="auth-link">
        Schon registriert? <a href="/login">Hier einloggen</a>
      </p>
    </div>
  )
}
