<script>
    import * as THREE from 'three';
    import { onMount, onDestroy } from 'svelte';
    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
    import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

    let resizeListener;
    let mouseListener;

    let scene, camera, renderer, grid, gridCellSize, clock;
    let composer, bloomPass;
    let personModel;
    let isMouseDown = false;
    let rotateStartX = 0;

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
            
            // Animate the person model if it exists
            if (personModel) {
                // Update animation mixer if it exists
                if (personModel.mixer) {
                    personModel.mixer.update(delta);
                }
            }
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
                2.0, // Strength
                0.8, // Radius 
                0.03  // Threshold
            );
            composer.addPass(bloomPass);

            const gridSize = 30; 
            const gridDivisions = 30; 
            gridCellSize = gridSize / gridDivisions; 

            const centerLineColor = 0xff00ff; // Magenta
            const gridLinesColor = 0x00ffff;  // Cyan
            grid = new THREE.GridHelper(gridSize, gridDivisions, centerLineColor, gridLinesColor);
            
            // Enhance grid material for better visibility with bloom
            if (grid.material instanceof THREE.Material) {
                grid.material.opacity = 0.8;
                grid.material.transparent = true;
            } else if (Array.isArray(grid.material)) {
                grid.material.forEach(mat => {
                    if (mat) {
                        mat.opacity = 0.8;
                        mat.transparent = true;
                    }
                });
            }
            
            scene.add(grid);
            
            // Load the person model
            loadPersonModel();
            
            // Set up mouse event listeners for model rotation
            setupModelInteraction();
            
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

    // Function to load the person model
    function loadPersonModel() {
        // Create a loading manager to track progress
        const loadingManager = new THREE.LoadingManager();
        loadingManager.onProgress = (url, loaded, total) => {
            console.log(`Loading model: ${url} ${Math.round(loaded / total * 100)}%`);
        };
        loadingManager.onLoad = () => {
            console.log("Model loading complete.");
        };
        
        // Use FBXLoader to load the sitting idle animation model
        const loader = new FBXLoader(loadingManager);
        loader.load(
            '/Sitting Idle.fbx', // Path to the animated model
            (object) => {
                personModel = object;
                
                // Position the model on the right side of the scene
                personModel.position.set(1, 0, -.2); // x: right side, y: on the floor, z: slightly forward
                
                // Scale the model to an appropriate size
                const scale = 0.01; // FBX models often need smaller scale
                personModel.scale.set(scale, scale, scale);
                
                // Add the model to the scene
                scene.add(personModel);
                
                // Setup enhanced lighting for the model
                setupModelLighting();
                
                // Check for animations and set up mixer if they exist
                if (object.animations && object.animations.length > 0) {
                    console.log(`Found ${object.animations.length} animations in the model`);
                    personModel.mixer = new THREE.AnimationMixer(object);
                    const idleAction = personModel.mixer.clipAction(object.animations[0]);
                    idleAction.play();
                }
                
                console.log("Person model (Sitting Idle) loaded successfully");
            },
            (xhr) => {
                // Loading progress
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                // Error handling
                console.error('An error occurred while loading the person model:', error);
                // Removed fallback model loading for mockup
            }
        );
        
        // Removed timeout for mockup
    }
    
    // Set up enhanced lighting specifically for the model
    let modelLights = [];
    
    function setupModelLighting() {
        // Create an array to store all lights for easier cleanup
        modelLights = [];
        
        // Key light - main illumination from the front-right (increased intensity from 5 to 8)
        const keyLight = new THREE.SpotLight(0xffffff, 8, 25, Math.PI / 5, 0.3, 1);
        keyLight.position.set(5, 5, 0);
        keyLight.target.position.set(1, 1, .2); // Point at the model
        scene.add(keyLight);
        scene.add(keyLight.target);
        modelLights.push(keyLight);
        
        // Fill light - increased intensity (from 2.5 to 4) and slightly cooler color for contrast
        const fillLight = new THREE.PointLight(0x9090ff, 4, 20);
        fillLight.position.set(2, 3, -1);
        scene.add(fillLight);
        modelLights.push(fillLight);
        
        // Rim light - enhanced highlighting from behind for stronger silhouette (increased intensity from 3.5 to 6)
        const rimLight = new THREE.SpotLight(0xffaa00, 6, 20, Math.PI / 7, 0.3, 1);
        rimLight.position.set(4, 4, -6);
        rimLight.target.position.set(1, 1, -2);
        scene.add(rimLight);
        scene.add(rimLight.target);
        modelLights.push(rimLight);
        
        // Ground bounce light - slightly increased for better visibility (from 1.0 to 1.5)
        const bounceLight = new THREE.PointLight(0x606060, 1.5, 10);
        bounceLight.position.set(5, -0.5, -2);
        scene.add(bounceLight);
        modelLights.push(bounceLight);
        
        // Additional front light for more visibility (increased intensity from 2.0 to 3.0)
        const frontLight = new THREE.PointLight(0xffffcc, 3.0, 15);
        frontLight.position.set(1, 2, 4);
        scene.add(frontLight);
        modelLights.push(frontLight);
    }

    // Function to load a fallback model if the first one fails
    function loadFallbackPersonModel() {
        console.log("Fallback model logic removed for mockup.");
    }
    
    // Function to set up mouse interaction for rotating the model
    function setupModelInteraction() {
        const containerElement = document.getElementById('three-container');
        
        // Mouse down event - start rotation
        mouseListener = {
            mousedown: (event) => {
                // Check if clicking near the model (right side of screen)
                if (event.clientX > window.innerWidth / 2) {
                    isMouseDown = true;
                    rotateStartX = event.clientX;
                    
                    // Change cursor to grabbing
                    containerElement.style.cursor = 'grabbing';
                }
            },
            
            mousemove: (event) => {
                if (isMouseDown && personModel) {
                    // Calculate rotation amount based on mouse movement
                    const rotateAmount = (event.clientX - rotateStartX) * 0.01;
                    personModel.rotation.y += rotateAmount;
                    rotateStartX = event.clientX;
                }
            },
            
            mouseup: () => {
                isMouseDown = false;
                // Reset cursor
                containerElement.style.cursor = 'auto';
            },
            
            mouseleave: () => {
                isMouseDown = false;
                // Reset cursor
                containerElement.style.cursor = 'auto';
            },
            
            // Touch events for mobile
            touchstart: (event) => {
                // Check if touching near the model (right side of screen)
                if (event.touches[0].clientX > window.innerWidth / 2) {
                    isMouseDown = true;
                    rotateStartX = event.touches[0].clientX;
                }
            },
            
            touchmove: (event) => {
                if (isMouseDown && personModel) {
                    event.preventDefault();
                    // Calculate rotation amount based on touch movement
                    const rotateAmount = (event.touches[0].clientX - rotateStartX) * 0.01;
                    personModel.rotation.y += rotateAmount;
                    rotateStartX = event.touches[0].clientX;
                }
            },
            
            touchend: () => {
                isMouseDown = false;
            }
        };
        
        // Add event listeners
        containerElement.addEventListener('mousedown', mouseListener.mousedown);
        containerElement.addEventListener('mousemove', mouseListener.mousemove);
        containerElement.addEventListener('mouseup', mouseListener.mouseup);
        containerElement.addEventListener('mouseleave', mouseListener.mouseleave);
        
        // Touch events for mobile
        containerElement.addEventListener('touchstart', mouseListener.touchstart);
        containerElement.addEventListener('touchmove', mouseListener.touchmove, { passive: false });
        containerElement.addEventListener('touchend', mouseListener.touchend);
    }
    
    onDestroy(() => {
        // Remove event listeners
        if (resizeListener) {
            window.removeEventListener('resize', resizeListener);
        }
        
        // Remove mouse event listeners
        if (mouseListener) {
            const containerElement = document.getElementById('three-container');
            if (containerElement) {
                containerElement.removeEventListener('mousedown', mouseListener.mousedown);
                containerElement.removeEventListener('mousemove', mouseListener.mousemove);
                containerElement.removeEventListener('mouseup', mouseListener.mouseup);
                containerElement.removeEventListener('mouseleave', mouseListener.mouseleave);
                
                containerElement.removeEventListener('touchstart', mouseListener.touchstart);
                containerElement.removeEventListener('touchmove', mouseListener.touchmove);
                containerElement.removeEventListener('touchend', mouseListener.touchend);
            }
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
        
        // Dispose of person model resources
        if (personModel) {
            scene.remove(personModel);
            
            // Recursively dispose of all geometries and materials
            personModel.traverse((child) => {
                if (child.geometry) {
                    child.geometry.dispose();
                }
                
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
        
        // Remove all model-specific lights
        if (modelLights && modelLights.length > 0) {
            modelLights.forEach(light => {
                scene.remove(light);
                if (light.target) scene.remove(light.target);
            });
            modelLights = [];
        }
    });
</script>

<div style="position: relative; width: 100%; height: 100vh;">
    <div id="three-container" style="width: 100%; height: 100vh;"></div>
    
    <!-- Loading indicator removed for mockup -->
    
    <!-- Instruction tooltip for model interaction -->
    <div style="position: absolute; bottom: 30px; right: 30px; background: rgba(0,0,0,0.7); color: white; padding: 10px 15px; border-radius: 5px; font-size: 14px; pointer-events: none;">
    
    </div>
</div>

<style>
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

