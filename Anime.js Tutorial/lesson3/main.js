// Lesson 3 — Keyframes
//
// Assign an array to any property to step through multiple values:
//   translateX: [0, 100, 50, 200]
//
// For more control, pass an array of objects — each step can override
// its own 'duration' and 'easing':
//   translateX: [
//     { value: 100, duration: 400, easing: 'easeInQuad' },
//     { value: 200, duration: 800 }
//   ]
//
// The top-level 'keyframes' option is equivalent but lets multiple properties
// change together at each step, keeping related changes in one place:
//   keyframes: [
//     { translateX: 100, scale: 1.2 },
//     { translateX: 0,   scale: 1   }
//   ]
//
// Total duration = sum of all step durations, or the top-level 'duration'
// divided equally if individual steps don't specify their own.

anime({
  targets: '#kf-box',
  keyframes: [
    { translateX:   0, translateY:   0, scale: 1,   borderRadius: '8px'  },
    { translateX: 140, translateY: -70, scale: 0.7, borderRadius: '50%', easing: 'easeInQuad' },
    { translateX: 280, translateY:   0, scale: 1.3, borderRadius: '8px'  },
    { translateX: 140, translateY:  70, scale: 0.7, borderRadius: '50%'  },
    { translateX:   0, translateY:   0, scale: 1,   borderRadius: '8px'  }
  ],
  duration: 3400,
  easing: 'easeInOutSine',
  loop: true
});
