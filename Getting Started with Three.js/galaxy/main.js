/**
 * Three.js — Particle Galaxy
 *
 * Renders a glowing three-armed spiral galaxy using only Points geometry —
 * no textures, no external assets.
 *
 * Key concepts:
 *
 *   BufferGeometry  — stores vertex data in flat typed arrays (Float32Array)
 *                     that are uploaded directly to the GPU. Far more efficient
 *                     than keeping each vertex as a JS object.
 *
 *   BufferAttribute — wraps a typed array and tells Three.js the item size
 *                     (3 for x/y/z positions, 3 for r/g/b colours).
 *
 *   Points          — renders geometry as individual dots instead of triangles.
 *
 *   PointsMaterial  — controls dot size, colour, and blending mode.
 *
 *   AdditiveBlending — overlapping particles add their colours together,
 *                      creating a bright, glowing core without any lighting.
 *
 *   vertexColors    — reads per-particle colour from the 'color' attribute
 *                     instead of using a single uniform material colour.
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Points,
  AdditiveBlending,
  Color,
  Clock,
} from 'three';

// ---------------------------------------------------------------------------
// Scene & camera
// ---------------------------------------------------------------------------
const scene = new Scene();

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 4.5, 7);
camera.lookAt(0, 0, 0);

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---------------------------------------------------------------------------
// Galaxy parameters — tweak these to reshape the galaxy
// ---------------------------------------------------------------------------
const COUNT  = 7000;  // total number of particles
const ARMS   = 3;     // number of spiral arms
const RADIUS = 5;     // outer radius in world units
const SPIN   = 1.8;   // how tightly each arm curls (higher = more rotations)
const SPREAD = 0.45;  // random scatter perpendicular to each arm

// ---------------------------------------------------------------------------
// Build the particle positions and colours
// ---------------------------------------------------------------------------
// Pre-allocate flat Float32Arrays: 3 values per particle (x, y, z / r, g, b).
// Flat arrays map directly to GPU buffer layout, so Three.js can upload them
// without any conversion.
const positions = new Float32Array(COUNT * 3);
const colors    = new Float32Array(COUNT * 3);

// Warm orange near the core, cool blue toward the outer edge.
const innerColor = new Color(0xff8844);
const outerColor = new Color(0x2244ff);

for (let i = 0; i < COUNT; i++) {
  const i3 = i * 3;

  // Spread particles evenly across arms; each gets a random radial distance.
  const armAngle  = ((i % ARMS) / ARMS) * Math.PI * 2;
  const dist      = Math.random() * RADIUS;
  const spinAngle = dist * SPIN; // outer particles are swept further around

  // Math.pow(x, 3) skews scatter toward zero — most particles hug the arm
  // centerline, with a few outliers creating the diffuse halo.
  const rx = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * SPREAD;
  const ry = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * SPREAD * 0.4;
  const rz = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * SPREAD;

  positions[i3    ] = Math.cos(armAngle + spinAngle) * dist + rx;
  positions[i3 + 1] = ry;   // keep the galaxy as a flat disk
  positions[i3 + 2] = Math.sin(armAngle + spinAngle) * dist + rz;

  // Lerp between the two reference colours based on distance from the core.
  const mixed = innerColor.clone().lerp(outerColor, dist / RADIUS);
  colors[i3    ] = mixed.r;
  colors[i3 + 1] = mixed.g;
  colors[i3 + 2] = mixed.b;
}

// ---------------------------------------------------------------------------
// BufferGeometry & attributes
// ---------------------------------------------------------------------------
const geometry = new BufferGeometry();
// BufferAttribute(typedArray, itemSize) — itemSize=3 means one (x,y,z) per vertex
geometry.setAttribute('position', new BufferAttribute(positions, 3));
geometry.setAttribute('color',    new BufferAttribute(colors,    3));

// ---------------------------------------------------------------------------
// Material
// ---------------------------------------------------------------------------
const material = new PointsMaterial({
  size: 0.025,               // world-space dot radius
  sizeAttenuation: true,     // dots shrink with distance (perspective)
  depthWrite: false,         // stops nearby particles from hiding distant ones
  blending: AdditiveBlending, // bright glow: overlapping dots sum their colour
  vertexColors: true,        // use the 'color' attribute set above
});

// ---------------------------------------------------------------------------
// Points object
// ---------------------------------------------------------------------------
const galaxy = new Points(geometry, material);
scene.add(galaxy);

// ---------------------------------------------------------------------------
// Resize handling
// ---------------------------------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------------------------------------------------------
// Animation loop
// ---------------------------------------------------------------------------
const clock = new Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // Slowly spin the whole galaxy
  galaxy.rotation.y = t * 0.04;

  // Gently bob the camera to reveal the disk's depth
  camera.position.y = 4.5 + Math.sin(t * 0.1) * 1.5;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();
