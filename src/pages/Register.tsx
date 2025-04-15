// 📁 src/pages/Register.tsx
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      alert("Registrierung erfolgreich! Du kannst dich jetzt einloggen.");
      navigate("/login");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2>Konto erstellen</h2>
        <form onSubmit={handleRegister}>
          <label>E-Mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Passwort wiederholen</label>
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">Registrieren</button>
        </form>

        <p className="switch">
          Bereits ein Konto? <a href="/login">Hier einloggen</a>
        </p>
      </div>
    </div>
  );
}
