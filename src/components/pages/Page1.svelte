<script>
</script>

<div class="page-container">

  <img
    src="/full_logo.png"
    alt="ResetXR Logo"
    style="filter: invert(1); width: 80%; max-width: 400px; margin: 0 auto 10px; display: block;"
  />
  <p style="text-align: center; margin-top: 0; font-size: 1.1rem;">Centro VR líder en Barcelona.</p>

  <h1 style="margin-top: 30px;">Main Hub</h1>
  <p>This is the primary content area, now managed by the Stage Manager.</p>
  <p>The Three.js scene from Index.svelte provides the animated background.</p>

  <button on:click={() => alert("page is interactive")}>click me!</button>
</div>

<style>
  .page-container {
    padding: 20px;
    border-radius: 8px;
    /* Background is handled by .page in stageManager.css */
    color: #fff;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* overflow-y: auto; /* Uncomment if content might exceed page height */
  }
  h1 {
    color: var(--highlight-color, #00ffff); /* Use CSS var from stageManager.css or fallback */
    margin-bottom: 15px;
  }
  /* Styling for the Reserve button within this page context if needed */
  /* The Reserve.svelte component itself should import its own dedicated styles */
</style>
