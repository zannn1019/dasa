<template>
  <section class="partners-section">
    <div class="map-bg" :style="{ backgroundImage: `url('/images/map-bg.webp')` }"></div>

    <div class="container-fluid overflow-hidden">
      <div
        class="partners-slider"
        ref="sliderRef"
        @mouseenter="pauseAnimation"
        @mouseleave="resumeAnimation"
      >
        <div class="partners-track">
          <div v-for="(partner, index) in partners" :key="index" class="partner-logo">
            <NuxtImg :src="partner.src" :alt="partner.name" format="webp" loading="lazy" />
          </div>
        </div>
        <div class="partners-track">
          <div v-for="(partner, index) in partners" :key="'dup-' + index" class="partner-logo">
            <NuxtImg
              :src="partner.src"
              :alt="partner.name"
              format="webp"
              loading="lazy"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { usePartnersAnimations } from "~/composables/usePartnersAnimations";

  const { getPageData, getAbsoluteImageUrl } = useCms();
  
  const { data: partnersDataResponse } = await getPageData('client', {
    clients: {
      populate: "*"
    }
  });
  
  const clientData = computed(() => {
    const raw = Array.isArray(partnersDataResponse.value?.data) 
      ? partnersDataResponse.value?.data?.[0]
      : partnersDataResponse.value?.data;
    return (raw || {}) as any;
  });

  const partners = computed(() => {
    return ((clientData.value.clients as any) || []).map((client: any) => ({
      name: client.name,
      src: getAbsoluteImageUrl((client.logo as any)?.url),
    }));
  });

  const sliderRef = ref<HTMLElement | null>(null);
  const { createInfiniteLoop, cleanup } = usePartnersAnimations();
  let animation: gsap.core.Tween | undefined | void;

  onMounted(() => {
    nextTick(() => {
      animation = createInfiniteLoop(sliderRef, 20);
    });
  });

  onUnmounted(() => {
    if (animation && typeof animation === 'object' && 'kill' in animation) {
      animation.kill();
    }
    cleanup();
  });

  const pauseAnimation = () => {
    if (animation && typeof animation === 'object' && 'pause' in animation) {
      animation.pause();
    }
  };
  const resumeAnimation = () => {
    if (animation && typeof animation === 'object' && 'play' in animation) {
      animation.play();
    }
  };
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
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
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
