<script>
// Page4.svelte
</script>

<div class="page-container">
  <h1>Page 4</h1>
  <p>This is the content for Page 4.</p>
  <button on:click={() => alert("Page 4 is interactive!")}>Click me (Page 4)</button>
  <p class="easter-egg">Demo made by Jake and Luca :3</p>
</div>

<style>
  .page-container {
    padding: 20px;
    border-radius: 8px;
    color: #fff; /* Assuming dark background from StageManager.css */
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  h1 {
    color: var(--highlight-color, #00ffff);
    margin-bottom: 15px;
  }
  .easter-egg {
    opacity: 0.1;
    transition: opacity 0.5s ease-in-out;
  }
  .page-container:hover .easter-egg {
    opacity: 1;
  }
</style>
