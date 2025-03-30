import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import '../styles/global.css';
import '../styles/layout.css';
import '../styles/form.css';


const Dashboard = ({ session }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    billing_cycle: 'monthly',
    due_date: '',
  });

  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('due_date', { ascending: true });

    if (!error) {
      setSubscriptions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('subscriptions').insert({
      ...form,
      price: parseFloat(form.price),
      user_id: session.user.id,
    });

    if (!error) {
      setForm({ name: '', price: '', billing_cycle: 'monthly', due_date: '' });
      fetchSubscriptions();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getMonthlyTotal = () => {
    return subscriptions
      .filter(sub => sub.billing_cycle === 'monthly')
      .reduce((acc, sub) => acc + parseFloat(sub.price), 0)
      .toFixed(2);
  };

  return (
    <div className="container">
  <div className="header">
    <h2>Your Subscriptions</h2>
    <button onClick={handleLogout}>Logout</button>
  </div>

  <form onSubmit={handleAdd}>
    ...
  </form>

  {!loading && (
    <div style={{ marginTop: '20px' }}>
      <h3>Total Monthly: ${getMonthlyTotal()}</h3>
      <ul>
        {subscriptions.map(sub => (
          <li key={sub.id}>
            {sub.name} – ${sub.price} – {sub.billing_cycle} – Due: {sub.due_date}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

  );
};

export default Dashboard;
