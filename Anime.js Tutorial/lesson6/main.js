// Lesson 6 — Colors & CSS Properties
//
// Anime.js can animate any numeric CSS property, not just transforms.
// Write property names in camelCase: border-radius → borderRadius.
//
// Color interpolation supports:
//   hex strings     — '#fc5c65', '#fff'
//   rgb()           — 'rgb(252, 92, 101)'
//   hsl()           — 'hsl(3, 96%, 67%)'
//
// To animate through more than two colors, pass an array.
// The animation steps through each value in sequence over the total duration.
//
// Non-color numeric properties (width, height, fontSize, etc.) just need a
// number or a string like '50%'. Anime.js strips the unit from the current
// computed style and lerps the numeric part.

anime({
  targets: '#blob',
  backgroundColor: ['#fc5c65', '#45aaf2', '#26de81', '#f7b731', '#fc5c65'],
  borderRadius:    ['12px', '50%', '12px', '30% 70% 70% 30% / 30% 30% 70% 70%', '12px'],
  width:  [70, 110,  70, 140, 70],
  height: [70,  70, 140,  70, 70],
  duration: 4000,
  easing: 'easeInOutSine',
  loop: true
});
