<script>
  import { onMount, afterUpdate } from 'svelte';
  import { initStageManager } from './StageManager.js';
  import Page1 from './pages/Page1.svelte';
  import Page2 from './pages/Page2.svelte';

  let canvas;
  let selectedIndex = null;
  let overlayRect = null;
  let stageManagerApi = null;
  let animationFrameId;

  const pages = [
    {
      id: 'home',
      title: 'Main Hub',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Cat_demonstrating_static_cling_with_styrofoam_peanuts.jpg',
      component: Page1
    },
    {
      id: 'gallery',
      title: 'VR Gallery',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Sobol_bur.jpg/640px-Sobol_bur.jpg',
      component: Page2
    }
  ];

  // Helper to get the plane's screen bounds for overlay
  function getPlaneScreenRect() {
    if (!canvas || selectedIndex === null || selectedIndex === -1) return null;
    // These must match StageManager.js logic
    const ACTIVE_PLANE_PADDING = 120;
    const ACTIVE_PLANE_Z = 2.2;
    const planeWidth = 2.4;
    const planeHeight = 1.5;
    const cameraZ = 5;
    const cameraFov = 75;
    const cameraAspect = canvas.clientWidth / canvas.clientHeight;
    const distance = cameraZ - ACTIVE_PLANE_Z;
    const halfFovRadians = Math.PI * (cameraFov / 180) / 2;
    const halfVisibleHeight = distance * Math.tan(halfFovRadians);
    const halfVisibleWidth = halfVisibleHeight * cameraAspect;
    const paddingWorldY = (ACTIVE_PLANE_PADDING / canvas.clientHeight) * (halfVisibleHeight * 2);
    const paddingWorldX = (ACTIVE_PLANE_PADDING / canvas.clientWidth) * (halfVisibleWidth * 2);
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
    // Center of screen
    const screenX = canvas.clientWidth / 2;
    const screenY = canvas.clientHeight / 2;
    // Scale to screen
    const scaleX = finalWidth / (halfVisibleWidth * 2) * canvas.clientWidth;
    const scaleY = finalHeight / (halfVisibleHeight * 2) * canvas.clientHeight;
    return {
      left: screenX - scaleX / 2,
      top: screenY - scaleY / 2,
      width: scaleX,
      height: scaleY
    };
  }

  function updateOverlayRectLoop() {
    if (selectedIndex !== null && selectedIndex !== -1) {
      overlayRect = getPlaneScreenRect();
      animationFrameId = requestAnimationFrame(updateOverlayRectLoop);
    }
  }

  onMount(() => {
    stageManagerApi = initStageManager(canvas, pages, (index) => {
      selectedIndex = index;
      if (selectedIndex !== null && selectedIndex !== -1) {
        updateOverlayRectLoop();
      } else {
        overlayRect = null;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      }
    });
    window.addEventListener('resize', () => {
      overlayRect = getPlaneScreenRect();
    });
  });

  afterUpdate(() => {
    if (selectedIndex !== null && selectedIndex !== -1 && !animationFrameId) {
      updateOverlayRectLoop();
    }
    if (selectedIndex === null || selectedIndex === -1) {
      overlayRect = null;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  });
</script>

<div class="stage-container">
  <canvas bind:this={canvas} class="three-canvas"></canvas>
  {#if selectedIndex !== null && selectedIndex !== -1 && overlayRect}
    <div
      class="page-overlay"
      style="position: fixed; left: {overlayRect.left}px; top: {overlayRect.top}px; width: {overlayRect.width}px; height: {overlayRect.height}px; z-index: 10; pointer-events: auto; background: none; box-shadow: 0 0 32px 8px rgba(0,0,0,0.25);">
      <svelte:component this={pages[selectedIndex].component} />
    </div>
  {/if}
</div>

<style>
  .stage-container {
    position: relative;
    width: 100vw;
    height: 100vh;
  }

  .three-canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 1;
  }
  .page-overlay {
    pointer-events: auto;
    /* No default background, so the real DOM is visible */
    overflow: auto;
    border-radius: 12px;
    /* Optional: add a subtle background for readability */
    background: rgba(10,20,40,0.85);
  }
</style>
