<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';

    let resizeListener;

    let scene, camera, renderer, grid, gridCellSize, clock;

    function animate() {
        if (!renderer || !scene || !camera) return; // Ensure Three.js objects are initialized

        requestAnimationFrame(animate);

        if (grid && clock) {
            const delta = clock.getDelta();
            const speed = 1.0; // Adjust for desired speed of grid lines

            grid.position.z = (grid.position.z + speed * delta) % gridCellSize;
        }
        
        renderer.render(scene, camera);
    }

    onMount(() => {
        const container = document.getElementById('three-container');

        if (container) {
            clock = new THREE.Clock();

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1a001a); // Dark purple/indigo

            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 1.5, 3); // x, y (height), z (distance from origin)
            camera.lookAt(0, 0, -10);    // Look "into" the grid, slightly downwards

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            const gridSize = 100; // How large the grid is
            const gridDivisions = 100; // Number of lines
            gridCellSize = gridSize / gridDivisions; // Size of one cell, should be 1

            const centerLineColor = 0xff00ff; // Magenta
            const gridLinesColor = 0x00ffff;  // Cyan
            grid = new THREE.GridHelper(gridSize, gridDivisions, centerLineColor, gridLinesColor);
            
            scene.add(grid);

            animate(); // Start the animation loop

            resizeListener = () => {
                if (camera && renderer && container) {
                    camera.aspect = container.clientWidth / container.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.clientWidth, container.clientHeight);
                }
            };
            window.addEventListener('resize', resizeListener);
        }
    });

    onDestroy(() => {
        if (resizeListener) {
            window.removeEventListener('resize', resizeListener);
        }
        if (renderer) {
            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentNode) {
                 renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        }
    });
</script>

<div id="three-container" style="width: 100%; height: 100vh;"></div>
