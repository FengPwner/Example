// Lesson 4 — Timeline
//
// anime.timeline(options) creates a sequenced animation.
// Options passed to timeline() become defaults for every child animation.
//
// .add(params, offset) appends one animation step.
//
// The second argument 'offset' controls when the step starts:
//   (omitted)  — starts exactly when the previous step ends (sequential)
//   '-=300'    — starts 300ms BEFORE the previous step ends (overlap)
//   '+=200'    — starts 200ms AFTER the previous step ends (gap)
//   1000       — starts at exactly 1000ms from the timeline start (absolute)
//
// The timeline instance supports the same .play() / .pause() / .restart()
// controls as regular animations (see lesson 7).

var tl = anime.timeline({
  loop: true,
  direction: 'alternate',
  easing: 'easeOutExpo',
  duration: 700
});

tl.add({ targets: '#tl-a', translateX: 240, background: '#f7b731' })
  .add({ targets: '#tl-b', translateX: 240, background: '#26de81' }, '-=400')
  .add({ targets: '#tl-c', translateX: 240, background: '#fc5c65' }, '-=400');
