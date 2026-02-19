<template>
  <section class="partners-section">
    <div class="map-bg" :style="{ backgroundImage: `url(${mapBg})` }"></div>

    <div class="container-fluid overflow-hidden">
      <div
        class="partners-slider"
        ref="sliderRef"
        @mouseenter="pauseAnimation"
        @mouseleave="resumeAnimation"
      >
        <!-- Original Set -->
        <div class="partners-track">
          <div v-for="(partner, index) in partners" :key="index" class="partner-logo">
            <img :src="partner.src" :alt="partner.name" />
          </div>
        </div>
        <!-- Duplicate Set for Seamless Loop -->
        <div class="partners-track">
          <div v-for="(partner, index) in partners" :key="'dup-' + index" class="partner-logo">
            <img :src="partner.src" :alt="partner.name" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import mapBg from "~/assets/images/map-bg.png";
  import { usePartnersAnimations } from "~/composables/usePartnersAnimations";

  // Import partner logos directly to ensure they are bundled
  // Ideally, use a glob import if many, but for 8 it's fine or explicit
  import astra from "~/assets/partners/Astra-Graphia-Information-Technology-1024x535.png";
  import itGroup from "~/assets/partners/IT-Group-Indonesia1.png";
  import indosat from "~/assets/partners/Indosat-1024x546.png";
  import mpm from "~/assets/partners/Mitra-Pinasthika-Mulia1-1024x280.png";
  import pgn from "~/assets/partners/PGN-Solution.png";
  import prodia from "~/assets/partners/Prodia-Widyahusada.png";
  import sigma from "~/assets/partners/Sigma-Cipta-Caraka1-1024x302.png";
  import sinarmas from "~/assets/partners/Sinarmas-Finance.png";

  const partners = [
    { name: "Astra Graphia", src: astra },
    { name: "IT Group", src: itGroup },
    { name: "Indosat", src: indosat },
    { name: "MPM", src: mpm },
    { name: "PGN Solution", src: pgn },
    { name: "Prodia", src: prodia },
    { name: "Sigma Cipta Caraka", src: sigma },
    { name: "Sinarmas Finance", src: sinarmas },
  ];

  const sliderRef = ref<HTMLElement | null>(null);
  const { createInfiniteLoop, cleanup } = usePartnersAnimations();
  let animation: gsap.core.Tween | undefined;

  onMounted(() => {
    // Wait for images to load or just a tick
    nextTick(() => {
      // Calculate duration based on width? or fixed speed
      // Let's use a fixed reasonable duration for now, maybe 30s
      animation = createInfiniteLoop(sliderRef, 20);
    });
  });

  onUnmounted(() => {
    animation?.kill();
    cleanup();
  });

  const pauseAnimation = () => animation?.pause();
  const resumeAnimation = () => animation?.play();
</script>

<style scoped>
  .partners-section {
    position: relative;
    padding: var(--spacing-xl) 0;
    background-color: var(--dt-white);
    overflow: hidden;
  }

  .map-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 1;
    pointer-events: none;
  }

  .container-fluid {
    width: 100%;
    overflow: hidden;
  }

  .partners-slider {
    display: flex;
    width: fit-content;
  }

  .partners-track {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
    padding-right: var(--spacing-xl);
    flex-shrink: 0;
  }

  .partner-logo {
    opacity: 1;
    /* filter: grayscale(100%); */
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px; /* Fixed height container */
    width: 300px; /* Fixed width container to align nicely? Or auto? Auto is better for varied logos */
    width: auto;
    max-width: 300px;
  }

  .partner-logo img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    display: block;
  }

  .partner-logo:hover {
    opacity: 1;
    filter: grayscale(0%);
    transform: scale(1.05);
  }
</style>
