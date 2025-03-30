import React, { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div>
      {session ? (
        <Dashboard session={session} />
      ) : (
        <Auth onAuth={(data) => setSession(data.session)} />
      )}
    </div>
  );
}

export default App;
