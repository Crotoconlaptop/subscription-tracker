import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import '../styles/global.css';
import '../styles/layout.css';
import '../styles/form.css';
import '../styles/card.css';

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

    const dueDate =
      form.billing_cycle === 'monthly'
        ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
        : form.due_date;

    const { error } = await supabase.from('subscriptions').insert({
      ...form,
      price: parseFloat(form.price),
      user_id: session.user.id,
      due_date: dueDate,
    });

    if (!error) {
      setForm({ name: '', price: '', billing_cycle: 'monthly', due_date: '' });
      fetchSubscriptions();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this subscription?');
    if (!confirm) return;

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (!error) {
      fetchSubscriptions();
    }
  };

  const getTotalMonthlyAndAnnual = () => {
    const monthly = subscriptions
      .filter(sub => sub.billing_cycle === 'monthly')
      .reduce((acc, sub) => acc + parseFloat(sub.price), 0);

    const yearly = subscriptions
      .filter(sub => sub.billing_cycle === 'yearly')
      .reduce((acc, sub) => acc + parseFloat(sub.price) / 12, 0);

    return {
      monthly: monthly.toFixed(2),
      yearlyPortion: yearly.toFixed(2),
      total: (monthly + yearly).toFixed(2)
    };
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Your Subscriptions</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          placeholder="Service Name"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleInputChange}
          placeholder="Price (USD)"
          min="0"
          step="0.01"
          required
        />
        <select
          name="billing_cycle"
          value={form.billing_cycle}
          onChange={handleInputChange}
          required
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {form.billing_cycle === 'yearly' && (
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleInputChange}
            required
          />
        )}

        <button type="submit">Add Subscription</button>
      </form>

      {!loading && (
        <div style={{ marginTop: '20px' }}>
          {(() => {
            const { monthly, yearlyPortion, total } = getTotalMonthlyAndAnnual();
            return (
              <>
                <h3>Real Monthly Cost: ${total}</h3>
                <p>(Monthly subs: ${monthly}, Annual split: ${yearlyPortion})</p>
              </>
            );
          })()}

          <div className="card-list">
            {subscriptions.map(sub => (
              <div className="card" key={sub.id}>
                <h4>{sub.name}</h4>
                <p><strong>Price:</strong> ${sub.price}</p>
                <p>
                  <strong>Cycle:</strong>{' '}
                  {sub.billing_cycle === 'monthly' ? '📅 Monthly' : '📆 Yearly'}
                </p>
                <p><strong>Due:</strong> {sub.due_date}</p>
                <div className="actions">
                  <button onClick={() => handleDelete(sub.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
