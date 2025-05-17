<script>
    import { onMount } from 'svelte';

    onMount(() => {
        const logo = document.querySelector('.logo');
        setTimeout(() => {
            logo.style.opacity = 0;
        }, 2300);
    });
</script>

<img src="/icon.webp" alt="Logo" class="logo" style="z-index: 100;" />

<style>
    .logo {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20vw;
        height: auto;
        pointer-events: none;
        opacity: 0;
        animation: fadeOut 2.3s ease-in-out;
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        70% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>