// 📁 src/pages/ForgotPassword.tsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './Auth.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/reset-password' // Ändere später auf Vercel-URL
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="auth-container">
      <h2>Passwort zurücksetzen</h2>
      {sent ? (
        <p>Check deine E-Mails für den Link zum Zurücksetzen.</p>
      ) : (
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Link senden</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      <p className="auth-link">
        <a href="/login">Zurück zum Login</a>
      </p>
    </div>
  )
}
