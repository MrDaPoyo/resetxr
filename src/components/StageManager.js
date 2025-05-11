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
  const planeWidth = 2.4;
  const planeHeight = 1.5;

  const distanceToPlanes = camera.position.z - planesConstantZ;
  const halfFovRadians = THREE.MathUtils.degToRad(camera.fov / 2);
  const halfVisibleHeightAtDepth = distanceToPlanes * Math.tan(halfFovRadians);
  const halfVisibleWidthAtDepth = halfVisibleHeightAtDepth * camera.aspect;
  const viewportLeftEdgeX = -halfVisibleWidthAtDepth;

  const paddingFromLeftEdge = 1;
  const targetPlaneX = viewportLeftEdgeX + paddingFromLeftEdge + (planeWidth / 2);

  const baseY = 1.2;
  const ySpacing = 1.7;
  const sidebarRotation = 0.15;
  const sidebarScale = { x: 1, y: 1, z: 1 };
  const selectedScale = { x: 1, y: 1, z: 1 };
  const selectedZ = 1;
  const centerX = 0;
  const centerY = 0;

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
        selectWindow(-1);
        currentSelectedIndex = -1;
        if (onSelect) onSelect(-1, null);
      } else {
        selectWindow(index);
        currentSelectedIndex = index;

        const screenPos = toScreenPosition(selected, camera, canvas);
        if (onSelect) onSelect(index, screenPos);
      }
    } else {
      selectWindow(-1);
      currentSelectedIndex = -1;
      if (onSelect) onSelect(-1, null);
    }
  }

  function selectWindow(selectedIndex) {
    const activeIndex = selectedIndex;

    pages.forEach((_, i) => {
      const mesh = planes[i];
      const isActive = i === activeIndex;

      let targetPos, targetRot, targetScale;

      if (isActive) {
        targetPos = { x: centerX, y: centerY, z: selectedZ };
        targetRot = { y: 0 };
        targetScale = selectedScale;
      } else {
        let yIndex = i;
        if (activeIndex !== -1 && i > activeIndex) yIndex += 1;

        targetPos = {
          x: targetPlaneX,
          y: baseY - yIndex * ySpacing,
          z: planesConstantZ
        };
        targetRot = { y: sidebarRotation };
        targetScale = sidebarScale;
      }

      gsap.to(mesh.position, {
        ...targetPos,
        duration: 0.7,
        ease: 'power3.out'
      });

      gsap.to(mesh.rotation, {
        ...targetRot,
        duration: 0.5,
        ease: 'power3.out'
      });

      gsap.to(mesh.scale, {
        ...targetScale,
        duration: 0.7,
        ease: 'power3.out'
      });
    });
  }

  function toScreenPosition(obj, camera, canvas) {
    const vector = new THREE.Vector3();
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    const bounds = canvas.getBoundingClientRect();
    return {
      x: (vector.x + 1) / 2 * bounds.width,
      y: (-vector.y + 1) / 2 * bounds.height
    };
  }
}
