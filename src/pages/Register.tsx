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
  const [isVegetarian, setIsVegetarian] = useState(true); // Default auf vegetarisch
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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message || "Unbekannter Fehler");
      return;
    }

    // Profil erweitern
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      is_vegetarian: isVegetarian,
    });

    if (profileError) {
      setError("Fehler beim Speichern des Profils.");
      return;
    }

    alert("Registrierung erfolgreich – du kannst dich jetzt einloggen.");
    navigate("/login");
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

          <div className="veg-options">
            <label>Ernährungsstil:</label>
            <label>
              <input
                type="radio"
                name="veg"
                checked={isVegetarian}
                onChange={() => setIsVegetarian(true)}
              />
              Vegetarisch/Vegan
            </label>
            <label>
              <input
                type="radio"
                name="veg"
                checked={!isVegetarian}
                onChange={() => setIsVegetarian(false)}
              />
              Allesesser
            </label>
          </div>

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
