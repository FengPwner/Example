// Lesson 1 — Targets & Properties
//
// anime({ targets, ...properties }) is the core API.
// 'targets' accepts a CSS selector string, a DOM node, a NodeList, or an array.
//
// Animatable properties:
//   CSS transforms  — translateX, translateY, rotate, scale, skew, perspective
//   CSS values      — opacity, width, height, backgroundColor, borderRadius, ...
//   SVG attributes  — cx, cy, r, d, strokeDashoffset, ...
//   JS object keys  — any numeric property on a plain object
//
// Key options:
//   duration   — length of one cycle in ms (default: 1000)
//   loop       — true = repeat forever, or a number for a fixed count
//   direction  — 'normal' | 'reverse' | 'alternate' (alternate = yo-yo)
//   easing     — acceleration curve (see lesson 2)
//   delay      — ms before the animation begins
//
// anime() returns an animation instance — see lesson 7 for controls.

anime({
  targets: '#b-tx',
  translateX: 240,
  duration: 1200,
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutQuad'
});

anime({
  targets: '#b-rot',
  rotate: '1turn',     // '1turn' = 360deg; plain numbers are treated as degrees
  duration: 1400,
  loop: true,
  easing: 'linear'
});

anime({
  targets: '#b-sc',
  scale: [1, 1.8],     // [from, to] sets an explicit start value
  duration: 1000,
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutBack'
});

anime({
  targets: '#b-op',
  opacity: [1, 0.1],
  duration: 900,
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutSine'
});
