// 📁 src/pages/AuthLayout.tsx

import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-wrapper">
      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
}
