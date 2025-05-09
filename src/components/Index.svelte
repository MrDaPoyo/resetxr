<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

    let resizeListener;

    let scene, camera, renderer, grid, gridCellSize, clock;
    let composer, bloomPass;

    const initialCamPos = new THREE.Vector3(0, 4, 2); // Higher up, looking down
    const finalCamPos = new THREE.Vector3(0, 1.5, 3);   // Original position
    const initialLookAtTarget = new THREE.Vector3(0, 7, 0); // Look at grid origin initially
    const finalLookAtTarget = new THREE.Vector3(0, 0, -10); // Original lookAt target
    const currentLookAtTarget = new THREE.Vector3(); // To reuse in animation loop

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animate() {
        if (!renderer || !scene || !camera || !composer) return; 

        requestAnimationFrame(animate);

        if (grid && clock) {
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();
            
            // Grid speed ramping effect
            const gridRampDuration = 3.0;
            const gridT = Math.min(elapsed / gridRampDuration, 1.0);
            const initialSpeed = 5.0;
            const finalSpeed = 0.5;
            const speed = initialSpeed + (finalSpeed - initialSpeed) * gridT;

            grid.position.z = (grid.position.z + speed * delta) % gridCellSize;

            const cameraRampDuration = 4.0;
            let cameraT = Math.min(elapsed / cameraRampDuration, 1.0);
            
            const easedT = easeInOutQuad(cameraT);

            camera.position.lerpVectors(initialCamPos, finalCamPos, easedT);

            currentLookAtTarget.lerpVectors(initialLookAtTarget, finalLookAtTarget, easedT);
            camera.lookAt(currentLookAtTarget);
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
            
            let light = new THREE.AmbientLight(0xffffff, 1);

            // Create a spherical sun instead of flat circle
            let sun = new THREE.SphereGeometry(6, 32, 32);
            let sunMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xae0eae, // Purple
                emissive: 0xFFCC00, // Bright yellow
                emissiveIntensity: 1
            });
            let sunMesh = new THREE.Mesh(sun, sunMaterial);
            sunMesh.position.set(0, 0, -25); // Position it behind the grid

            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.copy(initialCamPos); 
            camera.lookAt(initialLookAtTarget);    

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            composer = new EffectComposer(renderer);
            const renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);

            bloomPass = new UnrealBloomPass(
                new THREE.Vector2(container.clientWidth, container.clientHeight),
                1.2, // Strength
                0.6, // Radius
                0.1  // Threshold
            );
            composer.addPass(bloomPass);

            const gridSize = 30; 
            const gridDivisions = 30; 
            gridCellSize = gridSize / gridDivisions; 

            const centerLineColor = 0xff00ff; // Magenta
            const gridLinesColor = 0x00ffff;  // Cyan
            grid = new THREE.GridHelper(gridSize, gridDivisions, centerLineColor, gridLinesColor);

            let bigBlackRectangle = new THREE.Mesh(
                new THREE.PlaneGeometry(gridSize, gridSize),
                new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
            );

            bigBlackRectangle.rotation.x = Math.PI / 2;
            bigBlackRectangle.position.y = -0.1;
            bigBlackRectangle.position.z = -0.1;
            
            scene.add(bigBlackRectangle);
            scene.add(grid);
            scene.add(light);
            scene.add(sunMesh);

            animate();

            resizeListener = () => {
                if (camera && renderer && container && composer) {
                    const width = container.clientWidth;
                    const height = container.clientHeight;

                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();

                    renderer.setSize(width, height);
                    composer.setSize(width, height);
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
        if (grid && grid.geometry && grid.material) {
            grid.geometry.dispose();
            if (grid.material.dispose) grid.material.dispose();
            else if (Array.isArray(grid.material)) {
                grid.material.forEach(material => material.dispose());
            }
        }
    });
</script>

<div id="three-container" style="width: 100%; height: 100vh;"></div>

