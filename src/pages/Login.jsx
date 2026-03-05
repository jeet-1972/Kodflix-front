import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Auth.css';

const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || '/dashboard';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({
        email: form.email.trim(),
        password: form.password,
      });

      navigate(DASHBOARD_URL, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <header className="auth-screen__header">
        <div className="auth-screen__logo">KODFLIX</div>
        <div className="auth-screen__link">
          New to KodFlix? <Link to="/signup">Sign up</Link>
        </div>
      </header>

      <div className="auth-screen__card">
        <h1 className="auth-screen__title">Sign In</h1>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="email">
              Email or Username
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="auth-form__input"
              placeholder="Enter your email or username"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="auth-form__input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button className="auth-form__button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing you in…' : 'Sign In'}
          </button>

          {error && <p className="auth-form__error">{error}</p>}

          <p className="auth-form__helper">
            This page is protected by Google reCAPTCHA to ensure you&apos;re not a bot.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

