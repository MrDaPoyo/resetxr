<script>
    let { left = false, width = 50, length = 3, styles = "" } = $props();
</script>

<div class="marquee {left ? 'left' : 'right'}" style="--length: {length}; {styles}" transition:persist>
    <div class="marquee-content">
        <div class="strip">
            {#each Array(width) as _}
                <div class="tile"></div>
            {/each}
        </div>
        
        <div class="strip">
            {#each Array(width) as _}
                <div class="tile"></div>
            {/each}
        </div>
    </div>
</div>

<style>
    .marquee {
        position: relative;
        width: 100%;
        height: fit-content;
        overflow: hidden;
    }

    .marquee-content {
        display: flex;
        width: max-content;
        animation-duration: calc(20s + (var(--length) * 5s));
        animation-timing-function: linear;
        animation-iteration-count: infinite;
    }

    .left .marquee-content {
        animation-name: scroll-left;
    }

    .right .marquee-content {
        animation-name: scroll-right;
    }

    .strip {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .tile {
        height: 40px;
        width: 40px;
        margin-right: 20px;
        background: url('/icon.webp') no-repeat;
        background-size: 150%;
        background-position: center;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
    }

    @keyframes scroll-left {
        0% { transform: translateX(0); }
        100% { transform: translateX(calc(-50% - 1px)); }
    }

    @keyframes scroll-right {
        0% { transform: translateX(calc(-50% - 1px)); }
        100% { transform: translateX(0); }
    }
</style>
