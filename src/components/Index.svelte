<script>
	import Hero from "./hero.svelte";
	import ScrollingBackground from "./scrolling_background.svelte";
</script>

<section class="hero">
	<Hero style="height: 100vh; width: 100vw; overflow-y: auto;" />
	<div class="fade">
		<style>
			.fade {
				position: absolute;
				top: 1px;
				left: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(
					to bottom,
					rgba(0, 0, 0, 0) 0%,
					rgba(0, 0, 0, 0.1) 90%,
					rgba(0, 0, 0, 1) 100%
				);
			}
		</style>
	</div>
	<div
		class="scroll-indicator"
		style="position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); z-index: 9999;"
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
</section>
<section class="game-carousel">
	<ScrollingBackground />
	<a href="#games" id="games" aria-label="Scroll to games section" style="color: white;">
		<h2>Nuestros Juegos</h2>
	</a>
	<p>Selecciona entre nuesta variedad de juegos, pasa el mouse por encima para revelar más informacion.</p>
	<style>
		.game-carousel {
			position: relative;
			width: 100%;
			overflow: hidden;
			background-color: #000;
		}
		.game-carousel h2 {
			color: white;
			text-align: center;
			margin-top: 20px;
		}
		.game-carousel p {
			color: white;
			text-align: center;
			margin-bottom: 20px;
		}
	</style>
</section>

