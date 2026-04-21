import { validateRsvp } from '../js/rsvp.js';

describe('validateRsvp', () => {
  test('valid form data passes', () => {
    const result = validateRsvp({ name: 'Budi', guests: 2, attend: 'hadir', message: '' });
    expect(result.valid).toBe(true);
  });

  test('empty name fails', () => {
    const result = validateRsvp({ name: '', guests: 1, attend: 'hadir', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/nama/i);
  });

  test('guests > 5 fails', () => {
    const result = validateRsvp({ name: 'Ani', guests: 6, attend: 'hadir', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/tamu/i);
  });

  test('guests < 1 fails', () => {
    const result = validateRsvp({ name: 'Ani', guests: 0, attend: 'hadir', message: '' });
    expect(result.valid).toBe(false);
  });

  test('missing attend fails', () => {
    const result = validateRsvp({ name: 'Ani', guests: 1, attend: '', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/kehadiran/i);
  });
});
