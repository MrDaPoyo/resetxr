<!-- src/components/pages/Page2.svelte -->
<div class="page-container">
  <h1>Page 2 - Gallery</h1>
  <p>This page could showcase a gallery of futuristic images or 3D models.</p>
  <div class="gallery-grid">
    <div class="gallery-item"></div>
    <div class="gallery-item"></div>
    <div class="gallery-item"></div>
    <div class="gallery-item"></div>
  </div>
</div>

<style>
  .page-container {
    padding: 20px;
    border-radius: 8px;
    background: rgba(10, 20, 40, 0.7);
    color: #fff;
    height: 100%;
    box-sizing: border-box;
  }
  h1 {
    color: #ae0eae; /* Magenta */
    margin-bottom: 15px;
  }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }
  .gallery-item {
    height: 120px;
    background: rgba(50, 50, 80, 0.8);
    border: 1px solid #00ffff;
    border-radius: 4px;
  }
</style>
