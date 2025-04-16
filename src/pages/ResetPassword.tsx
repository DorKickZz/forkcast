// 📁 src/pages/ResetPassword.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Auth.css'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.updateUser({ password })

    if (error) setError(error.message)
    else setConfirmed(true)
  }

  return (
    <div className="auth-container">
      <h2>Neues Passwort setzen</h2>
      {confirmed ? (
        <p>Dein Passwort wurde erfolgreich geändert!</p>
      ) : (
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Neues Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Passwort ändern</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      <p className="auth-link">
        <a href="/login">Zurück zum Login</a>
      </p>
    </div>
  )
}
