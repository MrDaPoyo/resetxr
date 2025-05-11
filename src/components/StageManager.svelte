<script>
  import { onMount } from 'svelte';
  import { initStageManager } from './StageManager.js';
  import Page1 from './pages/Page1.svelte';
  import Page2 from './pages/Page2.svelte';

  let canvas;
  let selectedIndex = null;
  let overlayX = 0;
  let overlayY = 0;

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

  onMount(() => {
    initStageManager(canvas, pages, (index, pos) => {
      selectedIndex = index;
      if (pos) {
        overlayX = pos.x;
        overlayY = pos.y;
      }
    });
  });
</script>

<div class="stage-container">
  <canvas bind:this={canvas} class="three-canvas"></canvas>

  {#if selectedIndex !== null && selectedIndex !== -1}
    <div
      class="page-overlay"
      style="transform: translate(-50%, -50%) translate({overlayX}px, {overlayY}px);"
    >
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
    position: absolute;
    z-index: 2;
    width: 640px;
    height: 400px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    pointer-events: auto;
  }
</style>
