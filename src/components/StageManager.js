import * as THREE from 'three';
import { gsap } from 'gsap';

export function initStageManager(canvas, pages, onSelect) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const planes = [];
  const textureLoader = new THREE.TextureLoader();

  const planesConstantZ = -1;
  const planeWidth = 1.6;

  const distanceToPlanes = camera.position.z - planesConstantZ;
  const halfFovRadians = THREE.MathUtils.degToRad(camera.fov / 2);
  const halfVisibleHeightAtDepth = distanceToPlanes * Math.tan(halfFovRadians);
  const halfVisibleWidthAtDepth = halfVisibleHeightAtDepth * camera.aspect;
  const viewportLeftEdgeX = -halfVisibleWidthAtDepth;

  const paddingFromLeftEdge = 1;
  const targetPlaneX = viewportLeftEdgeX + paddingFromLeftEdge + (planeWidth / 2);

  pages.forEach((page, i) => {
    const geometry = new THREE.PlaneGeometry(planeWidth, 1);
    const texture = textureLoader.load(page.thumbnail);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(targetPlaneX, 1.2 - i * 1.4, planesConstantZ); 
    
    mesh.rotation.y = 0.15;
    mesh.userData = { index: i };
    
    scene.add(mesh);
    planes.push(mesh);
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  function onClick(event) {
    const bounds = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planes);

    if (intersects.length > 0) {
      const selected = intersects[0].object;
      selectWindow(selected.userData.index);
    }
  }

  canvas.addEventListener('click', onClick);

  function selectWindow(index) {
    pages.forEach((_, i) => {
      const mesh = planes[i];
      const isActive = i === index;

      gsap.to(mesh.position, {
        x: isActive ? 0 : -1 + i * 0.4,
        y: isActive ? 0 : i * -0.4,
        z: isActive ? 0 : -i * 1.2,
        duration: 0.7,
        ease: 'power3.out'
      });

      gsap.to(mesh.rotation, {
        y: isActive ? 0 : -0.3,
        duration: 0.5,
        ease: 'power3.out'
      });

      if (isActive) {
        onSelect(index); 
      }
    });
  }
}
