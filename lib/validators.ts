// lib/validators.ts
export function isValidEmail(email: string): boolean {
  // Simple regex for client-side validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
