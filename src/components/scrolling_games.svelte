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
					<p>Balatro</p>
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
					<p>Balatro</p>
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
		will-change: transform;
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

	.strip {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.up .strip, .down .strip {
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
	}

    .tile:hover {
        filter: grayscale(0%);
    }

    .tile p {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 10px;
        text-align: center;
        border-radius: 0 0 10px 10px;
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
