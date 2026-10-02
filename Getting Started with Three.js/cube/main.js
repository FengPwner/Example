/**
 * Three.js — Spinning Cube
 *
 * The "Hello, World!" of Three.js. Every scene needs exactly four things:
 *
 *   1. Scene             — the container that holds all 3D objects
 *   2. PerspectiveCamera — defines what part of the scene we see
 *   3. Mesh              — a Geometry (shape) + Material (surface) pair
 *   4. WebGLRenderer     — draws the scene onto the <canvas> via WebGL
 *
 * The animation loop calls requestAnimationFrame to update and redraw
 * the scene roughly 60 times per second.
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
} from 'three';

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------
// A Scene is the root of the 3D world. Every object, light, and helper
// must be added to it before it can be rendered.
const scene = new Scene();

// ---------------------------------------------------------------------------
// Camera
// ---------------------------------------------------------------------------
// PerspectiveCamera(fov, aspect, near, far)
//   fov    — vertical field of view in degrees (75° is a comfortable default)
//   aspect — viewport width ÷ height (updated on resize below)
//   near   — anything closer than this distance is clipped
//   far    — anything further than this distance is clipped
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 2.5;   // step back so the cube at the origin is in view

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------
// WebGLRenderer draws the scene into a <canvas> element.
// antialias: true smooths jagged edges at a small performance cost.
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // cap at 2× for perf
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---------------------------------------------------------------------------
// Mesh = Geometry + Material
// ---------------------------------------------------------------------------
// BoxGeometry(width, height, depth) creates a unit cube made of triangles.
const geometry = new BoxGeometry(1, 1, 1);

// MeshNormalMaterial colours each face by the direction its surface points
// (its "normal" vector). No lights are needed — great for quick prototyping.
const material = new MeshNormalMaterial();

const cube = new Mesh(geometry, material);
scene.add(cube);

// ---------------------------------------------------------------------------
// Resize handling
// ---------------------------------------------------------------------------
// Update the camera's aspect ratio and the renderer's pixel dimensions
// whenever the browser window changes size.
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // must call this after changing camera props
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------------------------------------------------------------------
// Animation loop
// ---------------------------------------------------------------------------
// requestAnimationFrame schedules `animate` to run just before the next
// screen repaint (~60 fps). Rotating by a fixed delta each frame ties the
// speed to the frame rate; for frame-rate-independent motion see the
// Clock-based approach in the Lighting & Materials template.
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.005;
  cube.rotation.y += 0.009;

  renderer.render(scene, camera);
}
animate();
