<script setup>
  const currentSlide = ref(0);
  const slides = ["System Integration", "Data Integration", "Technology"];

  // Template refs
  const heroRef = ref(null);
  const titleRef = ref(null);
  const subtitleRef = ref(null);
  const buttonRef = ref(null);
  const sliderRef = ref(null);

  const handleChange = (newIndex) => {
    currentSlide.value = newIndex;
  };

  // Animation composable
  const { initAnimations, cleanup } = useHeroAnimations();

  onMounted(() => {
    initAnimations({
      heroRef,
      titleRef,
      subtitleRef,
      buttonRef,
      sliderRef,
    });
  });

  onUnmounted(() => {
    cleanup();
  });
</script>

<template>
  <section ref="heroRef" class="hero-section">
    <div class="container content">
      <div class="title">
        <div class="main-title">
          <h1 ref="titleRef">Most Reliable and Trusted Technology Company</h1>
          <div ref="buttonRef">
            <BaseButton variant="primary" size="lg" radius="sm">Let's Connect</BaseButton>
          </div>
        </div>
        <p ref="subtitleRef" class="sub-title">
          We are a company to help you with system integration, data integration technology
          implementation, big data implementation, development, and management services.
        </p>
      </div>
    </div>
    <div ref="sliderRef" class="slider">
      <BasePagination
        :current-index="currentSlide"
        :total-items="slides.length"
        :labels="slides"
        @change="handleChange"
      />
    </div>
  </section>
</template>

<style scoped>
  .slider {
    position: absolute;
    right: 5%;
    bottom: 10%;
  }
  .hero-section {
    width: 100%;
    height: 100vh;
    background-image: url("~/assets/images/hero-bg-2.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: var(--color-text-inverse);
    overflow: hidden;
    display: flex;
    align-items: center;
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    height: 100%;
    width: var(--hero-content-width);
    position: relative;
  }

  .title h1 {
    font-size: var(--font-size-7xl);
    font-weight: var(--font-weight-regular);
  }

  .content {
    height: 100%;
  }

  .sub-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-regular);
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding-bottom: var(--spacing-16);
  }

  .main-title {
    will-change: transform, opacity;
  }

  /* Responsive width adjustments */
  @media (max-width: 1440px) {
    .title {
      width: var(--hero-content-width-lg);
    }
  }

  @media (max-width: 1024px) {
    .title {
      width: var(--hero-content-width-md);
    }
  }

  @media (max-width: 768px) {
    .title {
      width: var(--hero-content-width-sm);
    }
  }

  @media (max-width: 480px) {
    .title {
      width: var(--hero-content-width-xs);
    }
  }
</style>
