<div class="marquee">
  <div class="marquee-track">
    <div class="marquee-inner">
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
    </div>
    <div class="marquee-inner">
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
      <div class="tile"></div>
    </div>
  </div>
</div>

<style>
	.marquee {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 200px;
}

.marquee-track {
  display: flex;
  width: fit-content;
  animation: scroll 10s linear infinite;
}

.marquee-inner {
  display: flex;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.tile {
  width: 120px;
  height: 180px;
  margin-right: 20px;
  background: url('https://placehold.co/120x180') center/cover no-repeat;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
}
</style>
