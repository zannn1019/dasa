<script setup>
const { getPageData, getAbsoluteImageUrl } = useCms();

const { data: heroData } = await getPageData('hero-section', {
  slides: {
    populate: "*"
  }
});

const content = computed(() => {
  const data = heroData.value?.data;
  return {
    title: data?.title,
    subtitle: data?.subtitle,
    buttonText: data?.buttonText,
    buttonLink: data?.buttonLink,
  };
});


const slides = computed(() => heroData.value?.data?.slides ?? []);

const currentSlide = ref(0);

const backgroundImage = computed(() => {
  const s = slides.value[currentSlide.value] || slides.value[0];
  return s && s.image ? `url(${getAbsoluteImageUrl(s.image?.url)})` : '';
});

const slideLabels = computed(() =>
  slides.value.map((s) => (s?.title ))
);

const heroRef = ref(null);
const titleRef = ref(null);
const subtitleRef = ref(null);
const buttonRef = ref(null);
const sliderRef = ref(null);

const handleChange = (newIndex) => {
  const i = Math.max(0, Math.min(newIndex, Math.max(0, slides.value.length - 1)));
  currentSlide.value = i;
};

const { initAnimations, cleanup } = useHeroAnimations();

onMounted(() => {
  initAnimations({ heroRef, titleRef, subtitleRef, buttonRef, sliderRef });
});

onUnmounted(() => {
  cleanup();
});
</script>

<template>
  <section ref="heroRef" class="hero-section" :style="{ '--bg-image': backgroundImage }">
    <div class="container content">
      <div class="title">
        <div class="main-title">
          <h1 ref="titleRef" data-lang>{{ content.title }}</h1>
          <div ref="buttonRef">
            <BaseButton variant="primary" size="lg" radius="sm" :to="content.buttonLink" data-lang>
              {{ content.buttonText }}
            </BaseButton>
          </div>
        </div>
        <p ref="subtitleRef" class="sub-title" data-lang>
          {{ content.subtitle }}
        </p>
      </div>
    </div>
    <div ref="sliderRef" class="slider">
      <BasePagination
        :current-index="currentSlide"
        :total-items="slides.length"
        :labels="slideLabels"
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
    z-index: 2;
  }

  .hero-section {
    width: 100%;
    height: 100vh;
    position: relative;
    background-size: unset;
    background-position: unset;
    background-repeat: unset;
    color: var(--color-text-inverse);
    overflow: hidden;
    display: flex;
    align-items: center;
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  }

  .hero-section::before {
    content: '';
    position: absolute;
    inset: 0;
    filter: brightness(0.55);
    background-image: var(--bg-image);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
  }

  .container.content {
    position: relative;
    z-index: 1;
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
    font-size: clamp(2rem, 1.5rem + 2vw, 5rem);
    font-weight: var(--font-weight-regular);
    line-height: 1.2;
  }

  .content {
    height: 100%;
  }

  .sub-title {
    font-size: clamp(1rem, 0.875rem + 0.5vw, 1.25rem);
    font-weight: var(--font-weight-regular);
    line-height: 1.6;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    padding-bottom: var(--spacing-16);
  }

  .main-title {
    will-change: transform, opacity;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
  }

  @media (max-width: 1440px) {
    .title {
      width: var(--hero-content-width-lg);
    }
  }

  @media (max-width: 1024px) {
    .sub-title {
      font-size: clamp(0.875rem, 0.1rem + 0.3vw, 1rem);
    }

    .title {
      width: var(--hero-content-width-lg);
    }
  }

  @media (max-width: 768px) {
    .slider {
      display: none;
    }
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
