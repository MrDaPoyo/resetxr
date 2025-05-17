<script>
	let { direction = "down", width = 10, length = 3, styles = "" } = $props();
	const tiles = Array(width);
</script>

<div class="marquee {direction}" style="--length: {length}; {styles}">
	<div class="marquee-content">
		<div class="strip">
			{#each tiles as _}
				<div class="tile">
					<img
						alt="Balatro"
						src="/library_600x900.jpg"
						draggable="false"
					/>
					<div class="backtile">
						<h3>Balatro</h3>
						<p>
							Balatro es un juego de cartas único que combina
							estrategia y diversión.<br />¡Prueba tu suerte
							ahora!<small
								>No nos responsabilizamos de cualquier perdida
								de dinero ocasionada por las apuestas.</small
							>
						</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="strip">
			{#each Array(width) as _}
				<div class="tile">
					<img
						alt="Balatro"
						src="/library_600x900.jpg"
						draggable="false"
					/>
					<div class="backtile">
						<h3>Balatro</h3>
						<p>
							Balatro es un juego de cartas único que combina
							estrategia y diversión.<br />¡Prueba tu suerte
							ahora!<small
								>No nos responsabilizamos de cualquier perdida
								de dinero ocasionada por las apuestas.</small
							>
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="css">
	.marquee {
		position: relative;
		width: 100%;
		height: fit-content;
		overflow: hidden;
		max-height: 70vh;
	}

	.marquee-content {
		display: flex;
		width: 100%;
		animation-duration: calc(35s + (var(--length) * 5s));
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		padding: 10px;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		will-change: transform opacity filter;
		animation-play-state: running;
	}

	.left .marquee-content {
		animation-name: scroll-left;
	}

	.right .marquee-content {
		animation-name: scroll-right;
	}

	.up .marquee-content {
		animation-name: scroll-up;
		flex-direction: column;
	}

	.down .marquee-content {
		animation-name: scroll-down;
		flex-direction: column;
	}

	.marquee-content:hover {
		animation-play-state: paused;
	}

	.strip {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.up .strip,
	.down .strip {
		flex-direction: column;
		margin-bottom: 20px;
	}

	.tile {
		height: auto;
		position: relative;
		width: 100%;
		display: flex;
		flex-grow: 1;
		margin: 10px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
		transition: 0.1s ease-in-out;
		filter: grayscale(100%);
		border-radius: 25px;
		overflow: hidden;
		will-change: transform opacity filter;
	}

	.backtile {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: auto;
		font-size: 1rem;
		backdrop-filter: blur(10px);
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		z-index: 100;
	}

	.backtile h3 {
		margin: 0;
		font-size: 1.5rem;
	}

	.tile:hover {
		.backtile {
			opacity: 1;
		}
	}

	.tile img {
		width: 100%;
		height: auto;
		display: block;
	}

	.tile::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.5);
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
	}
	.tile:hover::after {
		opacity: 1;
	}

	.tile:hover {
		filter: grayscale(0%);
		transform: scale(1.05);
		display: block;
	}

	@keyframes scroll-left {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-50% - 1px));
		}
	}

	@keyframes scroll-right {
		0% {
			transform: translateX(calc(-50% - 1px));
		}
		100% {
			transform: translateX(0);
		}
	}
	@keyframes scroll-up {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(calc(-50% - 1px));
		}
	}

	@keyframes scroll-down {
		0% {
			transform: translateY(calc(-50% - 1px));
		}
		100% {
			transform: translateY(0);
		}
	}
</style>
