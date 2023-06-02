const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor(0x242424);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
let model;

loader.load('./model/lamborghini.glb', function (gltf) {
  model = gltf.scene;
  scene.add(model);

  // Adjust the position and scale of the model if needed
  model.position.set(0, 1.1, 0);
  model.scale.set(0.8, 0.8, 0.8);

  // Enable shadows for the model
  model.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  // Create mirrored floor
  const floorGeometry = new THREE.PlaneGeometry(20, 20, 20, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x101010, metalness: 0.5, roughness: 0.4 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
  floor.receiveShadow = true; // Enable shadow casting for the floor
  scene.add(floor);

  // Create an environment map for reflection
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(512, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });
  const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);
  cubeCamera.position.copy(floor.position);
  scene.add(cubeCamera);

  floorMaterial.envMap = cubeRenderTarget.texture;
  floorMaterial.needsUpdate = true;

  // Render the environment map for reflection
  cubeCamera.update(renderer, scene);

}, undefined, function (error) {
  console.error(error);
});

camera.position.x = -5;
camera.position.y = 2;
camera.position.z = -5;

// Add directional light
// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.copy(camera.position); // Set the light position set(3, 2, 1)
// scene.add(light);

// Add directional lights from different sides
const light1 = new THREE.DirectionalLight(0xffffff, 0.5);
light1.position.set(1, 1, 1);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
light2.position.set(-1, -1, -1);
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 0.5);
light3.position.set(1, -1, 1);
scene.add(light3);

const light4 = new THREE.DirectionalLight(0xffffff, 2);
light4.position.set(-1, 1, -1);
scene.add(light4);

// Add ambient light for overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);

// 



// 

// Add OrbitControls for rotation and zooming
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Add damping for smooth movements
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.2;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update(); // Update controls in every frame
}
animate();