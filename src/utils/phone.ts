/** Формат номера с 7. */
export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) return `7${digits.slice(1)}`;
  return digits;
}

/** green api для MAX принимает только номера РФ (7, 11 цифр) и РБ (375, 12 цифр). */
export function isValidPhone(phone: string): boolean {
  return /^7\d{10}$/.test(phone) || /^375\d{9}$/.test(phone);
}

export function formatPhone(phone: string): string {
  const ru = /^7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone);
  if (ru) return `+7 ${ru[1]} ${ru[2]}-${ru[3]}-${ru[4]}`;
  const by = /^375(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(phone);
  if (by) return `+375 ${by[1]} ${by[2]}-${by[3]}-${by[4]}`;
  return `+${phone}`;
}
