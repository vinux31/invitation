import { getTimeRemaining } from '../js/countdown.js';

describe('getTimeRemaining', () => {
  test('returns zeros when target is in the past', () => {
    const past = new Date(Date.now() - 1000);
    const r = getTimeRemaining(past);
    expect(r.passed).toBe(true);
    expect(r.days).toBe(0);
  });

  test('calculates days correctly for future date', () => {
    const future = new Date(Date.now() + 36 * 60 * 60 * 1000); // 36 jam = 1.5 hari → days = 1
    const r = getTimeRemaining(future);
    expect(r.passed).toBe(false);
    expect(r.days).toBe(1);
  });

  test('calculates hours within a day', () => {
    const future = new Date(Date.now() + 5 * 60 * 60 * 1000);
    const r = getTimeRemaining(future);
    expect(r.passed).toBe(false);
    expect(r.days).toBe(0);
    expect(r.hours).toBeGreaterThanOrEqual(4);
  });

  test('returns seconds in range 0-59', () => {
    const future = new Date(Date.now() + 90 * 1000);
    const r = getTimeRemaining(future);
    expect(r.seconds).toBeGreaterThanOrEqual(0);
    expect(r.seconds).toBeLessThan(60);
  });
});
