// 📁 src/pages/AuthLayout.tsx
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./AuthLayout.css";

export default function AuthLayout() {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="auth-wrapper">
      <main className={`auth-content ${isLanding ? "landing-fullscreen" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}
