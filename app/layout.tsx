// app/layout.tsx
import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Cadastro de Usuários',
  description: 'Base Next.js + MongoDB',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
