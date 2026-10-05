// lightning-talk.html
// 1. Make 1,200 dots, one per agent. 700 random ones get the "attacker" class
//    and turn red. Each dot waits a little longer than the last
//    (animation-delay), which makes them light up in a wave.
// 2. When a screen scrolls into view, add "in-view" so its CSS animations start.

const dots = document.getElementById('dots');
const TOTAL = 1200;
const ATTACKERS = 700;

// Pick 700 random dots to be attackers. A fixed seed means the same dots
// are picked every time, so the picture is the same on every computer.
let seed = 42;
function random() {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
}
const order = [...Array(TOTAL).keys()].sort(() => random() - 0.5);
const attackers = new Set(order.slice(0, ATTACKERS));

for (let i = 0; i < TOTAL; i++) {
  const dot = document.createElement('span');
  dot.style.animationDelay = (i * 2) + 'ms';   // light up in a wave, left to right
  if (attackers.has(i)) {
    dot.className = 'attacker';
    // after all dots are on, the attackers turn red one by one, in random order
    dot.style.animationDelay = (i * 2) + 'ms, ' + (2600 + order.indexOf(i) * 3) + 'ms';
  }
  dots.appendChild(dot);
}

const watcher = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.4 });

document.querySelectorAll('.screen').forEach((screen) => watcher.observe(screen));
