// Lesson 7 — Controls & Callbacks
//
// anime() returns an animation instance with these methods:
//   .play()         — start or resume from the current position
//   .pause()        — freeze at the current position
//   .restart()      — reset to the beginning and play
//   .reverse()      — flip the playback direction
//   .seek(ms)       — jump to a specific time without playing
//   .tick(time)     — manually advance the animation (for custom render loops)
//
// Useful instance properties:
//   .progress       — current completion, 0–100
//   .currentTime    — current position in ms
//   .paused         — boolean
//   .began          — boolean, true after the first frame
//
// Callbacks (set as options):
//   begin(anim)        — fires once before the first frame
//   update(anim)       — fires every frame
//   complete(anim)     — fires when the animation ends (not triggered per loop)
//   loopBegin(anim)    — fires at the start of each loop iteration
//   loopComplete(anim) — fires at the end of each loop iteration
//
// autoplay: false keeps the animation paused until you call .play().

var statusEl = document.getElementById('ctrl-status');

var anim = anime({
  targets: '#ctrl-box',
  translateX: 360,
  backgroundColor: ['#fc5c65', '#f7b731'],
  borderRadius: ['8px', '50%'],
  duration: 2000,
  easing: 'easeInOutQuad',
  autoplay: false,
  update: function(a) {
    statusEl.textContent = Math.round(a.progress) + '%  —  ' + Math.round(a.currentTime) + 'ms';
  },
  complete: function() {
    statusEl.textContent = 'complete!';
  }
});

document.getElementById('btn-play').onclick    = function() { anim.play(); };
document.getElementById('btn-pause').onclick   = function() { anim.pause(); };
document.getElementById('btn-restart').onclick = function() { anim.restart(); };
