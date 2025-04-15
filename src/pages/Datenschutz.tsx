import './Legal.css';

export default function Datenschutz() {
  return (
    <div className="legal-page">
      <h2>Datenschutzerklärung</h2>
      <p>
        Der Schutz deiner persönlichen Daten ist uns wichtig. Diese Website verwendet keine Cookies
        und speichert keine personenbezogenen Daten ohne deine ausdrückliche Zustimmung.
      </p>
      <p>
        Wenn du dich registrierst, speichern wir deine Login-Daten und deine Rezepte in einer sicheren
        Datenbank (Supabase). Deine Daten werden nicht an Dritte weitergegeben.
      </p>
      <p>
        Bei Fragen zum Datenschutz erreichst du uns unter: <a href="mailto:support@forkcast.app">support@forkcast.app</a>
      </p>
    </div>
  );
}
