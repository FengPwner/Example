/**
 * Three.js — Lighting & Materials
 *
 * This scene introduces the two most important light types and
 * MeshStandardMaterial — Three.js's physically-based (PBR) material.
 *
 * Lights covered:
 *   • AmbientLight     — uniform fill light, prevents pitch-black shadows
 *   • DirectionalLight — parallel sun-like rays, can cast shadow maps
 *   • PointLight       — omnidirectional bulb, attenuates with distance
 *
 * MeshStandardMaterial key properties:
 *   • color      — base albedo colour
 *   • metalness  — 0 = plastic/wood, 1 = metal
 *   • roughness  — 0 = mirror, 1 = fully diffuse
 *
 * Shadow maps: opt in per-renderer, per-light, and per-mesh.
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PCFSoftShadowMap,
  AmbientLight,
  DirectionalLight,
  PointLight,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  MeshStandardMaterial,
  Mesh,
  Color,
  Clock,
} from 'three';

// ---------------------------------------------------------------------------
// Scene & background
// ---------------------------------------------------------------------------
const scene = new Scene();
scene.background = new Color(0x1a1a2e);

// ---------------------------------------------------------------------------
// Camera — positioned above and in front, looking toward the origin
// ---------------------------------------------------------------------------
const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3, 6);
camera.lookAt(0, 0, 0);

// ---------------------------------------------------------------------------
// Renderer — shadow maps must be enabled on the renderer first
// ---------------------------------------------------------------------------
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap; // softer, more natural shadow edges
document.body.appendChild(renderer.domElement);

// ---------------------------------------------------------------------------
// Lights
// ---------------------------------------------------------------------------

// AmbientLight adds a constant, directionless base brightness.
// Keep it dim — its job is to soften shadows, not illuminate.
const ambient = new AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// DirectionalLight simulates the sun: parallel rays from one direction.
// Setting castShadow = true enables the shadow map for this light.
const sun = new DirectionalLight(0xffffff, 2.0);
sun.position.set(5, 8, 5);
sun.castShadow = true;
// The shadow camera is an orthographic frustum that defines which area
// of the scene can receive shadows. Expand these if shadows get clipped.
sun.shadow.camera.left   = -6;
sun.shadow.camera.right  =  6;
sun.shadow.camera.top    =  6;
sun.shadow.camera.bottom = -6;
sun.shadow.mapSize.set(1024, 1024); // higher resolution = sharper shadows
scene.add(sun);

// PointLight radiates in all directions from a single point, like a bulb.
// The third argument is the distance at which intensity reaches zero.
const rimLight = new PointLight(0x4040ff, 1.5, 12);
rimLight.position.set(-4, 3, -3);
scene.add(rimLight);

// ---------------------------------------------------------------------------
// Floor
// ---------------------------------------------------------------------------
// receiveShadow = true makes this mesh accept shadows cast by others.
const floor = new Mesh(
  new PlaneGeometry(12, 12),
  new MeshStandardMaterial({ color: 0x16213e, metalness: 0.0, roughness: 0.8 })
);
floor.rotation.x = -Math.PI / 2; // PlaneGeometry is vertical by default
floor.receiveShadow = true;
scene.add(floor);

// ---------------------------------------------------------------------------
// Sphere — low metalness, moderate smoothness
// ---------------------------------------------------------------------------
// castShadow = true makes this mesh project a shadow onto other surfaces.
const sphere = new Mesh(
  new SphereGeometry(0.8, 32, 32),
  new MeshStandardMaterial({ color: 0xe94560, metalness: 0.1, roughness: 0.3 })
);
sphere.position.set(-1.5, 0.8, 0);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// ---------------------------------------------------------------------------
// Torus — highly metallic, very smooth (almost mirror-like)
// ---------------------------------------------------------------------------
// TorusGeometry(radius, tube, radialSegments, tubularSegments)
const torus = new Mesh(
  new TorusGeometry(0.6, 0.22, 24, 64),
  new MeshStandardMaterial({ color: 0x0f3460, metalness: 0.8, roughness: 0.15 })
);
torus.position.set(1.5, 0.8, 0);
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);

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
// Clock.getElapsedTime() returns seconds since the clock was created.
// Driving animations from elapsed time keeps them frame-rate-independent:
// the scene looks the same whether running at 30 fps or 120 fps.
const clock = new Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // Sphere bobs on a sine wave
  sphere.position.y = 0.8 + Math.sin(t * 1.2) * 0.3;

  // Torus spins on two axes
  torus.rotation.x = t * 0.7;
  torus.rotation.y = t * 0.4;

  // Camera slowly orbits the scene
  camera.position.x = Math.sin(t * 0.15) * 6;
  camera.position.z = Math.cos(t * 0.15) * 6;
  camera.lookAt(0, 1, 0);

  renderer.render(scene, camera);
}
animate();
