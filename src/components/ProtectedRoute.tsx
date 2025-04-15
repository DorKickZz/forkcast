// 📁 src/components/ProtectedRoute.tsx

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthed(true);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  if (loading) return <p>Authentifizierung wird überprüft...</p>;

  if (!isAuthed) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
