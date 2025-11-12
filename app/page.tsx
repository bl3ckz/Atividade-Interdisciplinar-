// app/page.tsx
'use client';

import React, { useState } from 'react';
import Feedback from '../components/Feedback';
import { isValidEmail } from '../lib/validators';

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

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Cadastro de Usuários</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Seu nome"
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Cadastrar'}
          </button>
        </form>

        <Feedback type={success ? 'success' : 'error'} message={success || error} />
      </div>
    </main>
  );
}
