// 📁 src/pages/Register.tsx

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert('Registrierung fehlgeschlagen');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="auth-box">
      <h2>Registrierung</h2>
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
        <button type="submit">Registrieren</button>
      </form>
      <p>Schon registriert? <a href="/login">Zum Login</a></p>
    </div>
  );
}
