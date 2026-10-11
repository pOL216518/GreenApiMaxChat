import { describe, expect, it } from 'vitest';
import { formatPhone, isValidPhone, normalizePhone } from './phone';

describe('phone utils', () => {
  it('нормализует номер: убирает символы и заменяет 8 на 7', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('79991234567');
    expect(normalizePhone('8 999 123 45 67')).toBe('79991234567');
  });

  it('принимает только номера РФ и РБ', () => {
    expect(isValidPhone('79991234567')).toBe(true);
    expect(isValidPhone('375291234567')).toBe(true);
    expect(isValidPhone('7999123456')).toBe(false); // короткий
    expect(isValidPhone('380501234567')).toBe(false); // не РФ/РБ
  });

  it('форматирует номер для заголовка чата', () => {
    expect(formatPhone('79991234567')).toBe('+7 999 123-45-67');
  });
});
