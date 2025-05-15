<!-- src/components/Links.svelte -->
<script>
    import { createEventDispatcher } from 'svelte';

    export let links = [];
    const dispatch = createEventDispatcher();

    // default links
    if (links.length === 0) {
        links = [
            { id: 1, url: "#", imageUrl: "https://placehold.co/400", text: "Link 1" },
            { id: 2, url: "#", imageUrl: "https://placehold.co/400", text: "Link 2" },
            { id: 3, url: "#", imageUrl: "https://placehold.co/400", text: "Link 3" }
        ];
    }

    function select(link) {
        dispatch('select', { link });
    }
</script>

<div class="links-container">
    {#each links as link, i}
        <a
            href={link.url}
            class="link-item"
            style="animation-delay: {2 + i * 0.3}s;"
            on:click|preventDefault={() => select(link)}
        >
            <div class="trail-wrapper">
                <div class="trail trail-1" style="background-image: url({link.imageUrl});"></div>
                <div class="trail trail-2" style="background-image: url({link.imageUrl});"></div>
                <div class="trail trail-3" style="background-image: url({link.imageUrl});"></div>
                <img src={link.imageUrl} alt={link.text} class="main-image" />
                {#if link.text}
                    <div class="image-title">{link.text}</div>
                {/if}
            </div>
        </a>
    {/each}
</div>

<style>
    .links-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 2rem;
        z-index: 1000000;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);	
    }

    .link-item {
        opacity: 0;
        position: relative;
        display: inline-block;
        transform: translateY(-50px);
        animation: fadeInBounce 1s ease-out forwards;
        text-decoration: none;
        max-width: 10vw;
    }

    .trail-wrapper {
        position: relative;
        display: inline-block;
        margin: 10px;
    }

    .trail {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0;
        z-index: -1;
        animation: trailEffect 1s infinite;
    }

    .trail-1 {
        animation-delay: 0.1s;
        filter: blur(2px) brightness(0.8);
    }

    .trail-2 {
        animation-delay: 0.2s;
        filter: blur(4px) brightness(0.6);
    }

    .trail-3 {
        animation-delay: 0.3s;
        filter: blur(6px) brightness(0.4);
    }

    .main-image {
        max-width: 100%;
        height: auto;
        position: relative;
        z-index: 2;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))
                     drop-shadow(0 0 20px rgba(0, 255, 255, 0.6));
        transition: filter 0.3s, transform 0.3s;
        border: 2px solid #ff00ff;
        box-shadow: 0 0 10px #00ffff;
    }

    .link-item:hover .main-image {
        filter: drop-shadow(0 0 15px rgba(255, 255, 255, 1))
                     drop-shadow(0 0 30px rgba(0, 255, 255, 0.8));
        transform: scale(1.05);
    }

    .image-title {
        position: absolute;
        bottom: -25px;
        left: 0;
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 1.2rem;
        text-shadow: 2px 2px 0 #ff00ff, -2px -2px 0 #00ffff;
    }

    @keyframes fadeInBounce {
        0% {
            opacity: 0;
            transform: translateY(-50px);
        }
        50% {
            opacity: 0.7;
            transform: translateY(10px);
        }
        75% {
            transform: translateY(-5px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes trailEffect {
        0% {
            opacity: 0.6;
            transform: translateY(0);
        }
        50% {
            opacity: 0.3;
            transform: translateY(5px);
        }
        100% {
            opacity: 0;
            transform: translateY(10px);
        }
    }
</style>