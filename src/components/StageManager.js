import * as THREE from 'three';
import { gsap } from 'gsap';

export function initStageManager(canvas, pages, onSelectCallback) { // Renamed onSelect to onSelectCallback for clarity
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  // Add lights to the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft white light
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // White, somewhat directional
  directionalLight.position.set(0, 1, 1); // Position the light
  scene.add(directionalLight);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio for performance

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const planes = [];
  // REMOVED: const textureLoader = new THREE.TextureLoader();

  const planesConstantZ = -1;
  const planeWidth = 2.4;
  const planeHeight = 1.5;

  // Circle layout parameters
  const circleRadius = 3.5; // Radius of the circle for panel arrangement
  // const planeTiltX = 0; // Slight downward tilt for planes in the circle
  const planeTiltX = 0.02; // Apply a slighter downward tilt to inactive panels

  const sidebarScale = { x: 1, y: 1, z: 1 }; // Default scale for inactive planes
  const centerX = 0;
  const centerY = 0;

  const ACTIVE_PLANE_PADDING = 250; // Increased from 200 to make planes smaller
  const ACTIVE_PLANE_Z = 2.2;

  let currentSelectedIndex = -1;

  // Helper function to create a rounded rectangle texture for alphaMap
  function createRoundedRectAlphaMapTexture(textureWidth, textureHeight, cornerRadius) {
    const canvas = document.createElement('canvas');
    canvas.width = textureWidth;
    canvas.height = textureHeight;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white'; // The opaque part of the alpha map
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(textureWidth - cornerRadius, 0);
    ctx.quadraticCurveTo(textureWidth, 0, textureWidth, cornerRadius);
    ctx.lineTo(textureWidth, textureHeight - cornerRadius);
    ctx.quadraticCurveTo(textureWidth, textureHeight, textureWidth - cornerRadius, textureHeight);
    ctx.lineTo(cornerRadius, textureHeight);
    ctx.quadraticCurveTo(0, textureHeight, 0, textureHeight - cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
    ctx.closePath();
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    // texture.needsUpdate = true; // CanvasTexture typically handles this
    return texture;
  }

  // Create ONE shared material for all planes
  const sharedMaterial = new THREE.MeshPhysicalMaterial({
    metalness: 0.1,       // Low metalness for glass
    roughness: 0.85,      // Increased roughness for a more pronounced frosted look
    transmission: 0.8,    // Decreased transmission to make it slightly more 'milky'/frosted
    thickness: 0.2,       // Thickness for refraction (play with this value)
    ior: 1.5,             // Index of refraction for glass
    transparent: true,
    side: THREE.DoubleSide,
  });

  // Create and apply alphaMap for rounded corners to the shared material
  const alphaTextureWidth = 256; // Power-of-two size for the texture
  const alphaTextureHeight = Math.round(alphaTextureWidth / (planeWidth / planeHeight)); // Maintain aspect ratio
  const alphaCornerRadius = 30;   // Adjust for desired roundness in texture pixels

  const roundedRectTexture = createRoundedRectAlphaMapTexture(alphaTextureWidth, alphaTextureHeight, alphaCornerRadius);
  sharedMaterial.alphaMap = roundedRectTexture;

  pages.forEach((page, i) => {
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    
    // REMOVED: const material = new THREE.MeshPhysicalMaterial({ ... });
    // All planes now use the sharedMaterial instance
    const mesh = new THREE.Mesh(geometry, sharedMaterial);

    // Calculate position and rotation for circular layout
    const angle = (i / pages.length) * Math.PI * 2; // Distribute planes evenly
    const x = circleRadius * Math.cos(angle);
    const y = circleRadius * Math.sin(angle);

    mesh.position.set(x, y, planesConstantZ);
    mesh.rotation.y = angle + Math.PI / 2; // Orient planes to face outwards from circle center
    mesh.rotation.x = planeTiltX; // Apply tilt
    mesh.userData = { index: i, baseAngle: angle + Math.PI / 2 }; // Store base angle for animation

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
    
    // Ensure max dimensions are positive
    const maxPlaneWorldWidth = Math.max(0.1, (halfVisibleWidth * 2) - paddingWorldX * 2);
    const maxPlaneWorldHeight = Math.max(0.1, (halfVisibleHeight * 2) - paddingWorldY * 2);

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

    planes.forEach((mesh, i) => {
      const isActive = i === activeIndex;
      let targetPos, targetRot, targetScale;

      if (isActive) {
        targetPos = { x: centerX, y: centerY, z: ACTIVE_PLANE_Z };
        targetRot = { y: 0, x: 0, z: 0 }; // Face camera directly, no tilt
        targetScale = { x: scaleX, y: scaleY, z: 1 };
      } else {
        // Calculate position and rotation for circular layout
        const angle = (i / pages.length) * Math.PI * 2;
        const x = circleRadius * Math.cos(angle);
        const y = circleRadius * Math.sin(angle);

        targetPos = {
          x: x,
          y: y,
          z: planesConstantZ
        };
        targetRot = { y: angle + Math.PI / 2, x: planeTiltX, z: 0 }; // Orient outwards, apply tilt
        targetScale = sidebarScale;
      }

      // Normalize target Y rotation for shortest path
      let currentYRotation = mesh.rotation.y;
      let desiredYRotation = targetRot.y;

      let diffY = desiredYRotation - currentYRotation;
      while (diffY > Math.PI) {
        desiredYRotation -= 2 * Math.PI;
        diffY = desiredYRotation - currentYRotation; // Recalculate difference
      }
      while (diffY < -Math.PI) {
        desiredYRotation += 2 * Math.PI;
        diffY = desiredYRotation - currentYRotation; // Recalculate difference
      }
      // Create a new target rotation object with the normalized Y value
      const finalTargetRot = { ...targetRot, y: desiredYRotation };

      gsap.to(mesh.position, {
        ...targetPos,
        duration: 0.7,
        ease: 'power3.out',
        // onUpdate: renderScene // Removed: Main animate loop handles rendering
      });
      gsap.to(mesh.rotation, {
        // Use the normalized rotation target
        x: finalTargetRot.x,
        y: finalTargetRot.y,
        z: finalTargetRot.z,
        duration: 0.5,
        ease: 'power3.out',
        // onUpdate: renderScene // Removed: Main animate loop handles rendering
      });
      gsap.to(mesh.scale, {
        ...targetScale,
        duration: 0.7,
        ease: 'power3.out',
        // onUpdate: renderScene // Removed: Main animate loop handles rendering
      });
    });
  }

  // Helper function to project a 3D world position to 2D screen coordinates
  // Modified to accept pre-calculated canvas bounds and dimensions
  function projectToScreen(worldPositionVector, cam, canvasWidth, canvasHeight, canvasBounds) {
    const vector = worldPositionVector.clone();
    vector.project(cam); // Projects in place to Normalized Device Coordinates (NDC)

    // Convert NDC to screen coordinates relative to the viewport
    return {
      x: (vector.x + 1) / 2 * canvasWidth + canvasBounds.left,
      y: (-vector.y + 1) / 2 * canvasHeight + canvasBounds.top
    };
  }

  // NEW: Function to get the screen bounding box of a plane
  // Optimized and fixed to correctly project corners
  function getPlaneScreenBounds(index) {
    if (index < 0 || index >= planes.length) return null;

    const plane = planes[index];
    const originalWidth = plane.geometry.parameters.width;
    const originalHeight = plane.geometry.parameters.height;

    const currentWidth = originalWidth * plane.scale.x;
    const currentHeight = originalHeight * plane.scale.y;

    const cornersLocal = [
      new THREE.Vector3(-currentWidth / 2,  currentHeight / 2, 0), // Top-left
      new THREE.Vector3( currentWidth / 2,  currentHeight / 2, 0), // Top-right
      new THREE.Vector3( currentWidth / 2, -currentHeight / 2, 0), // Bottom-right
      new THREE.Vector3(-currentWidth / 2, -currentHeight / 2, 0)  // Bottom-left
    ];

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    plane.updateMatrixWorld(); // Ensure matrixWorld is up-to-date

    const canvasEl = renderer.domElement;
    const canvasBounds = canvasEl.getBoundingClientRect();
    const canvasWidth = canvasBounds.width; // Use actual bounds width
    const canvasHeight = canvasBounds.height; // Use actual bounds height

    cornersLocal.forEach(corner => {
      const worldPos = corner.clone().applyMatrix4(plane.matrixWorld);
      // Project world space corner to screen space using modified projectToScreen
      const screenPos = projectToScreen(worldPos, camera, canvasWidth, canvasHeight, canvasBounds);
      minX = Math.min(minX, screenPos.x);
      maxX = Math.max(maxX, screenPos.x);
      minY = Math.min(minY, screenPos.y);
      maxY = Math.max(maxY, screenPos.y);
    });

    // Check for invalid or zero-size bounding box
    if (minX === Infinity || maxX === -Infinity || minY === Infinity || maxY === -Infinity || maxX <= minX || maxY <= minY) {
      return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 }; // Return a zero-size rect
    }

    return {
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY,
      // Optionally, include right and bottom if needed by other parts of your application
      right: maxX,
      bottom: maxY 
    };
  }

  // REMOVED: updatePlaneTexture function

  // Handle window resize
  function onWindowResize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // If an item is selected, we might want to re-evaluate its scale/position
    // or simply let selectWindow handle it if called again (e.g. by a re-click)
    // For now, if an item is active, its size will be updated next time selectWindow is called
    // or if we explicitly call a re-positioning/scaling function here.
    // To ensure the active plane resizes immediately if it's already selected:
    if (currentSelectedIndex !== -1) {
      // Re-apply the selection logic to adjust size and position based on new aspect ratio
      // This will re-trigger animations, which might be desired or not.
      // A more subtle update would involve directly calculating and setting the new scale/pos
      // without the full animation. For simplicity, we can re-trigger.
      // selectWindow(currentSelectedIndex); // Option 1: Re-trigger full animation
      
      // Option 2: More direct update (example for scale, position might also need adjustment)
      const plane = planes[currentSelectedIndex];
      if (plane) {
        const distanceToActivePlane = camera.position.z - ACTIVE_PLANE_Z;
        const currentHalfFovRadians = THREE.MathUtils.degToRad(camera.fov / 2);
        const halfVisibleHeightAtActiveZ = distanceToActivePlane * Math.tan(currentHalfFovRadians);
        const halfVisibleWidthAtActiveZ = halfVisibleHeightAtActiveZ * camera.aspect;

        const paddingWorldY = (ACTIVE_PLANE_PADDING / renderer.domElement.clientHeight) * (halfVisibleHeightAtActiveZ * 2);
        const paddingWorldX = (ACTIVE_PLANE_PADDING / renderer.domElement.clientWidth) * (halfVisibleWidthAtActiveZ * 2);
        const maxPlaneWorldWidth = (halfVisibleWidthAtActiveZ * 2) - paddingWorldX * 2;
        const maxPlaneWorldHeight = (halfVisibleHeightAtActiveZ * 2) - paddingWorldY * 2;

        const planeAspect = planeWidth / planeHeight;
        let finalWidth = maxPlaneWorldWidth;
        let finalHeight = maxPlaneWorldHeight;

        if (finalWidth / planeAspect > finalHeight) {
          finalWidth = finalHeight * planeAspect;
        } else {
          finalHeight = finalWidth / planeAspect;
        }
        const newScaleX = finalWidth / planeWidth;
        const newScaleY = finalHeight / planeHeight;

        gsap.to(plane.scale, { x: newScaleX, y: newScaleY, z: 1, duration: 0.3, ease: 'power3.out' });
        // Position (centerX, centerY, ACTIVE_PLANE_Z) should still be correct.
      }
    }
  }
  window.addEventListener('resize', onWindowResize);

  return {
    // REMOVED: updatePlaneTexture from returned object
    getPlaneScreenBounds, // Expose the new function
    destroy: () => { // Cleanup function
      window.removeEventListener('resize', onWindowResize);
      canvas.removeEventListener('click', onClick);
      // Dispose Three.js resources if necessary (geometry, material, textures)
      // For simplicity, not fully implemented here but important for complex apps.
    }
  };
}