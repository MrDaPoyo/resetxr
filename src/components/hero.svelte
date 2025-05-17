<script>
	import * as THREE from "three";
	import { onMount, onDestroy } from "svelte";
	import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
	import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
	import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

	let resizeListener;

	let scene, camera, renderer, grid, gridCellSize, clock;
	let composer, bloomPass;

	const initialCamPos = new THREE.Vector3(0, 4, 2); // Higher up, looking down
	const finalCamPos = new THREE.Vector3(0, 1.5, 3); // Original position
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

			currentLookAtTarget.lerpVectors(
				initialLookAtTarget,
				finalLookAtTarget,
				easedT,
			);
			camera.lookAt(currentLookAtTarget);
		}

		composer.render();
	}

	onMount(() => {
		const container = document.getElementById("three-container");

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
				emissive: 0xffcc00, // Bright yellow
				emissiveIntensity: 1,
			});
			let sunMesh = new THREE.Mesh(sun, sunMaterial);
			sunMesh.position.set(0, 0, -25); // Position it behind the grid

			camera = new THREE.PerspectiveCamera(
				75,
				container.clientWidth / container.clientHeight,
				0.1,
				1000,
			);
			camera.position.copy(initialCamPos);
			camera.lookAt(initialLookAtTarget);

			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setSize(container.clientWidth, container.clientHeight);
			container.appendChild(renderer.domElement);

			composer = new EffectComposer(renderer);
			const renderPass = new RenderPass(scene, camera);
			composer.addPass(renderPass);

			bloomPass = new UnrealBloomPass(
				new THREE.Vector2(
					container.clientWidth,
					container.clientHeight,
				),
				1.2, // Strength
				0.6, // Radius
				0.1, // Threshold
			);
			composer.addPass(bloomPass);

			const gridSize = 30;
			const gridDivisions = 30;
			gridCellSize = gridSize / gridDivisions;

			const centerLineColor = 0xff00ff; // Magenta
			const gridLinesColor = 0x00ffff; // Cyan
			grid = new THREE.GridHelper(
				gridSize,
				gridDivisions,
				centerLineColor,
				gridLinesColor,
			);

			let bigBlackRectangle = new THREE.Mesh(
				new THREE.PlaneGeometry(gridSize, gridSize),
				new THREE.MeshBasicMaterial({
					color: 0x000000,
					side: THREE.DoubleSide,
				}),
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
			window.addEventListener("resize", resizeListener);
		}
	});

	onDestroy(() => {
		if (resizeListener) {
			window.removeEventListener("resize", resizeListener);
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
				grid.material.forEach((material) => material.dispose());
			}
		}
	});
</script>

<div id="three-container" style="width: 100%; height: 100vh;">
	<div class="inverse-gradient"></div>
</div>
<div class="hero">
	<div class="hero-text">
		<h1 style="font-size: 4rem; font-weight: bold; margin-bottom: 0;">Reset·XR</h1>
		<p style="font-size: 2rem; margin-top: 0;">Centro de realidad virtual líder en Barcelona</p>
		<a href="#games"><button>Explorar Juegos</button></a>
	</div>
	<div
		class="scroll-indicator"
		style="position: fixed; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 9999;"
	>
		<a
			href="#games"
			aria-label="Scroll down"
			style="text-decoration: none; position: relative; display: inline-block; width: 32px; height: 32px; background-color: rgba(0, 0, 0, 0.5); border-radius: 50%; padding: 8px;"
		>
			<svg
				id="scroll"
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				fill="white"
				viewBox="0 0 16 16"
			>
				<path
					fill-rule="evenodd"
					d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"
				/>
			</svg>
		</a>
	</div>
</div>

<style>
	.hero {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 100%;
		width: 100%;
		transform: translate(-50%, -50%);
		text-align: center;
		color: white;
		z-index: 100;
		font-size: 2rem;
	}
	.hero-text {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		z-index: 100;
	}

	.inverse-gradient {
		position: absolute;
		top: 0;
		left: 0;
		transform: translate(-50%, -50%);
		width: 400vw;
		height: 400vh;
		background: radial-gradient(
			circle,
			rgba(0, 0, 0, 0.5) 0%,
			rgba(0, 0, 0, 0.5) 50%,
			rgba(0, 0, 0, 1) 100%
		);
		z-index: 10;
	}

</style>
