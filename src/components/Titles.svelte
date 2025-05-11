<script>
    // fades the whole stack in once the scene is ready
    export let visible = false;
    import '../styles/titles.css'; // Import the CSS file
</script>

<!-- --- TYPOGRAPHY STACK --- -->
<div class="title-stack {visible ? 'visible' : ''}">
    <!-- main headline (always on top of the stack) -->
    <h1 class="layer main">Discover&nbsp;New&nbsp;Realities</h1>

    <!-- clones that sit behind / below the main headline -->
    <h1 class="layer clone d1">Discover&nbsp;New&nbsp;Realities</h1>
    <h1 class="layer clone d2">Discover&nbsp;New&nbsp;Realities</h1>

    <!-- flipped (mirror) clones for the lower half -->
    <h1 class="layer clone mirror m1">Discover&nbsp;New&nbsp;Realities</h1>
    <h1 class="layer clone mirror m2">Discover&nbsp;New&nbsp;Realities</h1>

    <!-- supportive subtitle -->
    <h2 class="subtitle">Step into the Metaverse</h2>
</div>
