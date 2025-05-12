<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { initStageManager } from './StageManager.js';
  import Page1 from './pages/Page1.svelte';
  import Page2 from './pages/Page2.svelte';
  import '../styles/StageManager.css';

  let canvasElement; // Renamed to avoid conflict with canvas global
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

  function updateOverlayRectLoop() {
    if (selectedIndex !== null && selectedIndex !== -1 && stageManagerApi) {
      const newRect = stageManagerApi.getPlaneScreenBounds(selectedIndex);
      if (newRect) {
        overlayRect = newRect;
      }
      animationFrameId = requestAnimationFrame(updateOverlayRectLoop);
    } else {
      overlayRect = null;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }

  onMount(() => {
    if (canvasElement) {
      stageManagerApi = initStageManager(canvasElement, pages, (index) => {
        const oldSelectedIndex = selectedIndex;
        selectedIndex = index;

        if (selectedIndex !== null && selectedIndex !== -1) {
          // If loop wasn't running or was for a different item, (re)start it.
          // The loop itself will fetch the new rect for the current selectedIndex.
          if (!animationFrameId) {
             updateOverlayRectLoop();
          }
        } else {
          // Deselected, updateOverlayRectLoop will see selectedIndex is invalid and stop itself
          // and clear overlayRect. Explicitly clear here just in case.
          overlayRect = null;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }

    // No Svelte-side resize listener needed for overlayRect,
    // as StageManager.js handles its camera/renderer updates,
    // and updateOverlayRectLoop will get correct coords.
  });

  onDestroy(() => {
    if (stageManagerApi && stageManagerApi.destroy) {
      stageManagerApi.destroy();
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  // afterUpdate is likely not needed anymore for managing the loop,
  // as the onSelect callback and the loop itself handle the logic.
  // $: console.log("Selected Index:", selectedIndex, "Overlay Rect:", overlayRect); // For debugging
</script>

<div class="stage-container">
  <canvas bind:this={canvasElement} class="three-canvas"></canvas>
  {#if selectedIndex !== null && selectedIndex !== -1 && overlayRect && overlayRect.width > 0 && overlayRect.height > 0}
    <div
      class="page-overlay"
      style="
        position: fixed;
        left: {overlayRect.left}px;
        top: {overlayRect.top}px;
        width: {overlayRect.width}px;
        height: {overlayRect.height}px;
        z-index: 10;
        /* pointer-events: auto; Ensure this is here or page content is not interactive */
        /* background: none; Allow component to set its background */
        box-shadow: 0 0 32px 8px rgba(0,0,0,0.25);
      "
    >
      <svelte:component this={pages[selectedIndex].component} />
    </div>
  {/if}
</div>