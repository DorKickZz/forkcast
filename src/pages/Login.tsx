import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './Login.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage(isLogin ? 'Login erfolgreich!' : 'Registrierung erfolgreich! Bitte E-Mail bestätigen.');
    }

    setLoading(false);
  };

  const handleReset = async () => {
    if (!email) return setMessage('Bitte E-Mail angeben');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Passwort-Reset Link gesendet!');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Registrierung'}</h2>
        <form onSubmit={handleAuth}>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Bitte warten…' : isLogin ? 'Einloggen' : 'Registrieren'}
          </button>
        </form>

        {isLogin && (
          <p className="reset" onClick={handleReset}>Passwort vergessen?</p>
        )}

        <p className="toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Noch kein Konto? Registrieren' : 'Schon registriert? Zum Login'}
        </p>

        {message && <p className="message">{message}</p>}

        <footer className="auth-footer">
          <small>© 2025 Forkcast – <a href="/impressum">Impressum</a> | <a href="/datenschutz">Datenschutz</a></small>
        </footer>
      </div>
    </div>
  );
}
