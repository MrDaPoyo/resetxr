<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

    let resizeListener;

    let scene, camera, renderer, grid, gridCellSize, clock;
    let composer, bloomPass; // For post-processing

    function animate() {
        if (!renderer || !scene || !camera || !composer) return; 

        requestAnimationFrame(animate);

        if (grid && clock) {
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();
            
            // Fun speed ramping effect on load
            const rampDuration = 3.0;
            const initialSpeed = 5.0;
            const finalSpeed = 0.5;
            const t = Math.min(elapsed / rampDuration, 1.0);
            const speed = initialSpeed + (finalSpeed - initialSpeed) * t;

            grid.position.z = (grid.position.z + speed * delta) % gridCellSize;
        }
        
        composer.render();
    }

    onMount(() => {
        const container = document.getElementById('three-container');

        if (container) {
            clock = new THREE.Clock();

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1a001a); // Dark purple/indigo
            scene.fog = new THREE.Fog(scene.background, 25, 50);


            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 1.5, 3); 
            camera.lookAt(0, 0, -10);    

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            composer = new EffectComposer(renderer);
            const renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);

            bloomPass = new UnrealBloomPass(
                new THREE.Vector2(container.clientWidth, container.clientHeight),
                1.2, // Strength: Intensity of the bloom.
                0.6, // Radius: Spread of the bloom.
                0.1  // Threshold: How bright a pixel needs to be to bloom. Lower values mean more bloom.
            );
            composer.addPass(bloomPass);

            const gridSize = 100; 
            const gridDivisions = 100; 
            gridCellSize = gridSize / gridDivisions; 

            const centerLineColor = 0xff00ff; // Magenta
            const gridLinesColor = 0x00ffff;  // Cyan
            grid = new THREE.GridHelper(gridSize, gridDivisions, centerLineColor, gridLinesColor);
            
            scene.add(grid);

            animate(); // Start the animation loop

            resizeListener = () => {
                if (camera && renderer && container && composer) {
                    const width = container.clientWidth;
                    const height = container.clientHeight;

                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();

                    renderer.setSize(width, height);
                    composer.setSize(width, height); // Resize the composer
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
        if (grid) {
            if (grid.geometry) grid.geometry.dispose();
            if (grid.material) grid.material.dispose();
        }
    });
</script>

<div id="three-container" style="width: 100%; height: 100vh;"></div>
