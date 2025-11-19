// components/Feedback.tsx
'use client';

import React from 'react';
import styles from '@/styles/Form.module.css';

type Props = {
  type: 'success' | 'error' | 'info';
  message: string | null;
};

export default function Feedback({ type, message }: Props) {
  if (!message) return null;

  const typeClass =
    type === 'success'
      ? `${styles.alert} ${styles.alertSuccess}`
      : type === 'error'
        ? `${styles.alert} ${styles.alertError}`
        : styles.alert;

  return (
    <div className={typeClass} role="alert" aria-live="polite">
      {message}
    </div>
  );
}
