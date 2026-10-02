// Lesson 2 — Easing
//
// The 'easing' property controls how an animation accelerates over time.
//
// Built-in easing families:
//   'linear'                            — constant speed, no acceleration
//   'easeIn/Out/InOut' + Sine           — gentle, sinusoidal curve
//   'easeIn/Out/InOut' + Quad/Cubic/... — polynomial curves (stronger = higher power)
//   'easeIn/Out/InOut' + Expo           — very sharp acceleration/deceleration
//   'easeIn/Out/InOut' + Back           — slight overshoot before settling
//   'easeOutElastic(amplitude, period)' — spring-like oscillation
//   'easeOutBounce'                     — bouncing ball simulation
//   'spring(mass, stiffness, damping)'  — physics-based spring (ignores duration)
//
// All easings work in any direction and with any duration.

var easings = [
  { name: 'linear',                value: 'linear' },
  { name: 'easeInOutQuad',         value: 'easeInOutQuad' },
  { name: 'easeOutExpo',           value: 'easeOutExpo' },
  { name: 'easeInOutBack',         value: 'easeInOutBack' },
  { name: 'easeOutElastic(1, .5)', value: 'easeOutElastic(1, .5)' },
  { name: 'easeOutBounce',         value: 'easeOutBounce' },
];

var container = document.getElementById('demo');

easings.forEach(function(e, i) {
  var row = document.createElement('div');
  row.className = 'row';
  row.innerHTML =
    '<span class="lbl">' + e.name + '</span>' +
    '<div class="ball ball-' + i + '"></div>';
  container.appendChild(row);

  anime({
    targets: '.ball-' + i,
    translateX: 230,
    duration: 1600,
    easing: e.value,
    loop: true,
    direction: 'alternate',
    delay: i * 80   // small stagger so they don't all start exactly together
  });
});
