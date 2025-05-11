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

  function selectWindow(selectedIndex) { // Renamed parameter to avoid conflict
    const activeScaleFactor = 2.5; // How much larger the active window should be
    const activeZPosition = 1;     // How close the active window comes to the camera (camera is at z=5)
    const inactiveItemRotationY = 0.15; // The default inward tilt for sidebar items

    pages.forEach((_, i) => {
      const mesh = planes[i];
      const isActive = i === selectedIndex;

      let targetPos = {};
      let targetRot = {};
      let targetScale = { x: 1, y: 1, z: 1 }; // Default to original scale

      if (isActive) {
        targetPos = {
          x: 0, // Center of the screen
          y: 0, // Center of the screen
          z: activeZPosition,
        };
        targetRot = {
          y: 0, // Face the camera directly
        };
        targetScale = {
          x: activeScaleFactor,
          y: activeScaleFactor,
          z: 1, // Scale is 2D for a plane
        };
        if (onSelect) {
          onSelect(selectedIndex); 
        }
      } else {
        // Return to, or stay in, the sidebar position
        targetPos = {
          x: targetPlaneX,    // Calculated X position for the sidebar
          y: 1.2 - i * 1.4, // Original Y stacking in the sidebar
          z: planesConstantZ, // Original Z depth in the sidebar
        };
        targetRot = {
          y: inactiveItemRotationY, // Original inward tilt
        };
        // Scale remains 1 (already set in targetScale default)
      }

      gsap.to(mesh.position, {
        ...targetPos,
        duration: 0.7,
        ease: 'power3.out',
      });

      gsap.to(mesh.rotation, {
        ...targetRot,
        duration: 0.5,
        ease: 'power3.out',
      });

      gsap.to(mesh.scale, {
        ...targetScale,
        duration: 0.7,
        ease: 'power3.out',
      });
    });
  }
}
