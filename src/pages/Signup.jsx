import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Auth.css';

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
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
      await signup({
        username: form.username.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      navigate('/login', { replace: true });
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
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </header>

      <div className="auth-screen__card">
        <h1 className="auth-screen__title">Sign Up</h1>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="auth-form__input"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="auth-form__input"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="auth-form__input"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
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
              autoComplete="new-password"
              className="auth-form__input"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <button className="auth-form__button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating your account…' : 'Sign Up'}
          </button>

          {error && <p className="auth-form__error">{error}</p>}

          <p className="auth-form__helper">
            By continuing, you agree to our Terms of Use and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;

