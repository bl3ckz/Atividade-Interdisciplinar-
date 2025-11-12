// components/Feedback.tsx
'use client';

import React from 'react';

type Props = {
  type: 'success' | 'error' | 'info';
  message: string | null;
};

export default function Feedback({ type, message }: Props) {
  if (!message) return null;

  const base = 'mt-4 px-4 py-3 rounded border';
  const styles = {
    success: `${base} bg-green-50 border-green-300 text-green-800`,
    error: `${base} bg-red-50 border-red-300 text-red-800`,
    info: `${base} bg-blue-50 border-blue-300 text-blue-800`,
  } as const;

  return <div className={styles[type]}>{message}</div>;
}
