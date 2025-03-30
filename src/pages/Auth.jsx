import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Auth = ({ onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

      console.log('signup result:', { data, error });

    if (error) {
      setError(error.message);
    } else {
      onAuth(data);
    }
  };
  const handleResendConfirmation = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
  
    if (error) {
      console.error('Resend error:', error);
      setError('Error resending email: ' + error.message);
    } else {
      alert('Confirmation email sent! Please check your inbox 📬');
    }
  };
  

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      {!isLogin && (
  <button
    type="button"
    onClick={handleResendConfirmation}
    disabled={!email}
    style={{ marginTop: '10px' }}
  >
    Resend confirmation email
  </button>
)}

      <p>
        {isLogin ? 'No account?' : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Auth;
