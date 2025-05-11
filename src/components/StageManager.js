import * as THREE from 'three';
import { gsap } from 'gsap';

export function initStageManager(canvas, pages, onSelectCallback) { // Renamed onSelect to onSelectCallback for clarity
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
  const planeWidth = 2.4;
  const planeHeight = 1.5;

  // Initial calculation for sidebar X position (could be made dynamic on resize if desired)
  let distanceToPlanes = camera.position.z - planesConstantZ;
  let halfFovRadians = THREE.MathUtils.degToRad(camera.fov / 2);
  let halfVisibleHeightAtDepth = distanceToPlanes * Math.tan(halfFovRadians);
  let halfVisibleWidthAtDepth = halfVisibleHeightAtDepth * camera.aspect;
  let viewportLeftEdgeX = -halfVisibleWidthAtDepth;
  const paddingFromLeftEdge = 1; // World units from left edge
  let targetPlaneX = viewportLeftEdgeX + paddingFromLeftEdge + (planeWidth / 2);


  const baseY = 1.2;
  const ySpacing = 1.7;
  const sidebarRotation = 0.15;
  const sidebarScale = { x: 1, y: 1, z: 1 };
  // const selectedScale = { x: 1, y: 1, z: 1 }; // Not used directly, calculated dynamically
  // const selectedZ = 1; // Not used directly, ACTIVE_PLANE_Z is used
  const centerX = 0;
  const centerY = 0;

  const ACTIVE_PLANE_PADDING = 200; // px, margin from viewport edge when active
  const ACTIVE_PLANE_Z = 2.2;

  let currentSelectedIndex = -1;

  pages.forEach((page, i) => {
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    const texture = textureLoader.load(page.thumbnail, (tex) => {
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
    });
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(targetPlaneX, baseY - i * ySpacing, planesConstantZ);
    mesh.rotation.y = sidebarRotation;
    mesh.userData = { index: i };

    scene.add(mesh);
    planes.push(mesh);
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  canvas.addEventListener('click', onClick);

  function onClick(event) {
    const bounds = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planes);

    if (intersects.length > 0) {
      const selected = intersects[0].object;
      const index = selected.userData.index;
      if (currentSelectedIndex === index) {
        selectWindow(-1); // Deselect
        currentSelectedIndex = -1;
        if (onSelectCallback) onSelectCallback(-1);
      } else {
        selectWindow(index);
        currentSelectedIndex = index;
        if (onSelectCallback) onSelectCallback(index);
      }
    } else {
      // Clicked outside: deselect
      selectWindow(-1);
      currentSelectedIndex = -1;
      if (onSelectCallback) onSelectCallback(-1);
    }
  }

  function renderScene() {
    renderer.render(scene, camera);
  }

  function selectWindow(selectedIndex) {
    const activeIndex = selectedIndex;

    const distance = camera.position.z - ACTIVE_PLANE_Z;
    const currentHalfFovRadians = THREE.MathUtils.degToRad(camera.fov / 2); // Use current camera FOV
    const halfVisibleHeight = distance * Math.tan(currentHalfFovRadians);
    const halfVisibleWidth = halfVisibleHeight * camera.aspect; // Use current camera aspect

    const paddingWorldY = (ACTIVE_PLANE_PADDING / renderer.domElement.clientHeight) * (halfVisibleHeight * 2);
    const paddingWorldX = (ACTIVE_PLANE_PADDING / renderer.domElement.clientWidth) * (halfVisibleWidth * 2);
    const maxPlaneWorldWidth = (halfVisibleWidth * 2) - paddingWorldX * 2;
    const maxPlaneWorldHeight = (halfVisibleHeight * 2) - paddingWorldY * 2;

    const planeAspect = planeWidth / planeHeight;
    let finalWidth = maxPlaneWorldWidth;
    let finalHeight = maxPlaneWorldHeight;

    if (finalWidth / planeAspect > finalHeight) {
      finalWidth = finalHeight * planeAspect;
    } else {
      finalHeight = finalWidth / planeAspect;
    }
    const scaleX = finalWidth / planeWidth;
    const scaleY = finalHeight / planeHeight;

    let visualIndexInSidebar = 0;
    planes.forEach((mesh, i) => {
      const isActive = i === activeIndex;
      let targetPos, targetRot, targetScale;

      if (isActive) {
        targetPos = { x: centerX, y: centerY, z: ACTIVE_PLANE_Z };
        targetRot = { y: 0 };
        targetScale = { x: scaleX, y: scaleY, z: 1 };
      } else {
        targetPos = {
          x: targetPlaneX,
          y: baseY - visualIndexInSidebar * ySpacing,
          z: planesConstantZ
        };
        visualIndexInSidebar++;
        targetRot = { y: sidebarRotation };
        targetScale = sidebarScale;
      }

      gsap.to(mesh.position, {
        ...targetPos,
        duration: 0.7,
        ease: 'power3.out',
        onUpdate: renderScene
      });
      gsap.to(mesh.rotation, {
        ...targetRot,
        duration: 0.5,
        ease: 'power3.out',
        onUpdate: renderScene
      });
      gsap.to(mesh.scale, {
        ...targetScale,
        duration: 0.7,
        ease: 'power3.out',
        onUpdate: renderScene
      });
    });
  }

  // Helper function to project a 3D world position to 2D screen coordinates
  function projectToScreen(worldPositionVector, cam, canvasEl) {
    const vector = worldPositionVector.clone();
    vector.project(cam); // Projects in place to Normalized Device Coordinates (NDC)

    const bounds = canvasEl.getBoundingClientRect(); // Get canvas position and size
    // Convert NDC to screen coordinates relative to the viewport
    return {
      x: (vector.x + 1) / 2 * bounds.width + bounds.left,
      y: (-vector.y + 1) / 2 * bounds.height + bounds.top
    };
  }

  // NEW: Function to get the screen bounding box of a plane
  function getPlaneScreenBounds(index) {
    if (index < 0 || index >= planes.length) return null;

    const plane = planes[index];
    // Original plane geometry dimensions (before scaling)
    const originalWidth = plane.geometry.parameters.width;
    const originalHeight = plane.geometry.parameters.height;

    // Current scaled dimensions in world space
    const currentWidth = originalWidth * plane.scale.x;
    const currentHeight = originalHeight * plane.scale.y;

    // Define 4 corner points in the local space of the plane (centered at origin)
    const cornersLocal = [
      new THREE.Vector3(-currentWidth / 2,  currentHeight / 2, 0), // Top-left
      new THREE.Vector3( currentWidth / 2,  currentHeight / 2, 0), // Top-right
      new THREE.Vector3( currentWidth / 2, -currentHeight / 2, 0), // Bottom-right
      new THREE.Vector3(-currentWidth / 2, -currentHeight / 2, 0)  // Bottom-left
    ];

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    plane.updateMatrixWorld(); // Ensure matrixWorld is up-to-date

    cornersLocal.forEach(corner => {
      // Transform local corner to world space
      const worldPos = corner.clone().applyMatrix4(plane.matrixWorld);
      // Project world space corner to screen space
      const screenPos = projectToScreen(worldPos, camera, renderer.domElement);

      minX = Math.min(minX, screenPos.x);
      maxX = Math.max(maxX, screenPos.x);
      minY = Math.min(minY, screenPos.y);
      maxY = Math.max(maxY, screenPos.y);
    });

    return {
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  function updatePlaneTexture(index, canvasEl) {
    if (!planes[index] || !canvasEl) return;
    const texture = new THREE.CanvasTexture(canvasEl);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    planes[index].material.map = texture;
    planes[index].material.needsUpdate = true;
  }

  // Handle window resize
  function onWindowResize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    // renderer.setPixelRatio(window.devicePixelRatio); // Usually set once, but good to be aware

    // Recalculate sidebar X position based on new aspect ratio
    distanceToPlanes = camera.position.z - planesConstantZ; // Stays same
    halfFovRadians = THREE.MathUtils.degToRad(camera.fov / 2); // Stays same
    halfVisibleHeightAtDepth = distanceToPlanes * Math.tan(halfFovRadians);
    halfVisibleWidthAtDepth = halfVisibleHeightAtDepth * camera.aspect; // This changes
    viewportLeftEdgeX = -halfVisibleWidthAtDepth; // This changes
    targetPlaneX = viewportLeftEdgeX + paddingFromLeftEdge + (planeWidth / 2); // This changes

    // If a window is not selected, or if you want sidebar items to snap to new position:
    if (currentSelectedIndex === -1) {
      planes.forEach((mesh, i) => {
        if (mesh.userData.index !== currentSelectedIndex) { // Avoid moving the active plane if one is selected
           gsap.to(mesh.position, { x: targetPlaneX, duration: 0.3 });
        }
      });
    }
    // If a window IS selected, its target X for when it returns to sidebar will be this new targetPlaneX.
    // The active plane's size/pos calc in selectWindow already uses current canvas dimensions.
  }
  window.addEventListener('resize', onWindowResize);

  return {
    updatePlaneTexture,
    getPlaneScreenBounds, // Expose the new function
    destroy: () => { // Cleanup function
      window.removeEventListener('resize', onWindowResize);
      canvas.removeEventListener('click', onClick);
      // Dispose Three.js resources if necessary (geometry, material, textures)
      // For simplicity, not fully implemented here but important for complex apps.
    }
  };
}