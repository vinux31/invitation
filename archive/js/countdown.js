export function getTimeRemaining(targetDate) {
  const total = targetDate - Date.now();
  if (total <= 0) return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    passed:   false,
    days:     Math.floor(total / (1000 * 60 * 60 * 24)),
    hours:    Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes:  Math.floor((total / (1000 * 60)) % 60),
    seconds:  Math.floor((total / 1000) % 60),
  };
}

function pad(n) { return String(n).padStart(2, '0'); }

export function initCountdown(targetDateStr) {
  const target  = new Date(targetDateStr);
  const grid    = document.getElementById('countdown-grid');
  const passed  = document.getElementById('countdown-passed');

  function tick() {
    const r = getTimeRemaining(target);
    if (r.passed) {
      grid.classList.add('hidden');
      passed.classList.remove('hidden');
      return;
    }
    document.getElementById('cd-days').textContent    = pad(r.days);
    document.getElementById('cd-hours').textContent   = pad(r.hours);
    document.getElementById('cd-minutes').textContent = pad(r.minutes);
    document.getElementById('cd-seconds').textContent = pad(r.seconds);
    setTimeout(tick, 1000);
  }
  tick();
}
