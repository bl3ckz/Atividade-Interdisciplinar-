// app/page.tsx
'use client';

import React, { useState } from 'react';
import Feedback from '../components/Feedback';
import { isValidEmail } from '../lib/validators';
import styles from '@/styles/Form.module.css';

export default function HomePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    // Client validation
    if (!name.trim()) return setError('Nome é obrigatório');
    if (!email.trim() || !isValidEmail(email)) return setError('Email inválido');
    if (!password || password.length < 8) return setError('Senha deve ter no mínimo 8 caracteres');

    try {
      setLoading(true);
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data?.error || 'Erro ao cadastrar');
        return;
      }

      setSuccess('Usuário cadastrado com sucesso!');
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Erro de rede');
    } finally {
      setLoading(false);
    }
  };

  const nameError = error === 'Nome é obrigatório';
  const emailError = error === 'Email inválido';
  const passwordError = error === 'Senha deve ter no mínimo 8 caracteres';

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Cadastro de Usuários</h1>
        <form onSubmit={onSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Seu nome"
              required
              aria-invalid={nameError ? 'true' : 'false'}
            />
            {nameError && (
              <span className={styles.helperText} role="alert">{error}</span>
            )}
          </div>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="seuemail@exemplo.com"
              required
              aria-invalid={emailError ? 'true' : 'false'}
            />
            {emailError && (
              <span className={styles.helperText} role="alert">{error}</span>
            )}
          </div>
            <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
              aria-invalid={passwordError ? 'true' : 'false'}
            />
            {passwordError && (
              <span className={styles.helperText} role="alert">{error}</span>
            )}
          </div>
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
        <div aria-live="polite">
          <Feedback type={success ? 'success' : 'error'} message={success || error} />
        </div>
      </div>
    </main>
  );
}
