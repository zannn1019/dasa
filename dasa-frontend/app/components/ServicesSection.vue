<script setup lang="ts">
  import contentData from "~/assets/content.json";

  const { getPageData, getAbsoluteImageUrl } = useCms();

  const { data: servicesResponse } = await getPageData("services", { image: true });

  const content = computed(() => ({
    title: contentData.services.title,
    subtitle: contentData.services.subtitle,
    watermark: contentData.services.watermark,
  }));

  const services = computed(() => {
    const raw = (servicesResponse.value as any)?.data ?? [];
    return [...raw]
      .sort(
        (a: any, b: any) =>
          (a.order ?? a.attributes?.order ?? 0) - (b.order ?? b.attributes?.order ?? 0),
      )
      .map((item: any) => {
        const attrs = item.attributes ?? item;
        return {
          title: attrs.title,
          desc: attrs.description,
          image: getAbsoluteImageUrl(attrs.image?.data?.attributes?.url ?? attrs.image?.url),
          link: `/services/${attrs.slug}`,
        };
      });
  });

  const sectionRef = ref<HTMLElement | null>(null);
  const watermarkRef = ref<HTMLElement | null>(null);
  const headerRef = ref<HTMLElement | null>(null);
  const titleRef = ref<HTMLElement | null>(null);
  const subtitleRef = ref<HTMLElement | null>(null);
  const controlsRef = ref<HTMLElement | null>(null);
  const scroller = ref<HTMLElement | null>(null);
  const cardsRef = shallowRef<HTMLElement[]>([]);

  const { initAnimations, createCardHoverEffect, animateNavButtons, cleanup } =
    useServicesAnimations();

  onBeforeUpdate(() => {
    cardsRef.value = [];
  });

  onMounted(() => {
    initAnimations(
      sectionRef,
      watermarkRef,
      headerRef,
      titleRef,
      subtitleRef,
      controlsRef,
      cardsRef,
    );
    createCardHoverEffect(cardsRef);
    animateNavButtons(controlsRef);
  });

  onUnmounted(() => {
    cleanup();
  });

  function scroll(direction: "left" | "right") {
    if (!scroller.value) return;
    const firstCard = scroller.value.querySelector(".service-card") as HTMLElement | null;
    const styles = getComputedStyle(scroller.value);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 320;
    const scrollAmount = cardWidth + gap;

    if (direction === "left") {
      scroller.value.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      scroller.value.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }
</script>

<template>
  <section class="services-section" ref="sectionRef">
    <div class="watermark" ref="watermarkRef" data-lang>{{ content.watermark }}</div>

    <div class="container services-container">
      <div class="services-header" ref="headerRef">
        <div class="header-text">
          <h2 class="section-title" ref="titleRef" data-lang>{{ content.title }}</h2>
          <p class="section-subtitle" ref="subtitleRef" data-lang>{{ content.subtitle }}</p>
        </div>

        <div class="slider-controls" ref="controlsRef">
          <button @click="scroll('left')" class="nav-button" aria-label="Scroll services left">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M15 18l-6-6 6-6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button @click="scroll('right')" class="nav-button" aria-label="Scroll services right">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M9 18l6-6-6-6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="cards-scroller" ref="scroller">
        <div
          class="service-card"
          v-for="(service, index) in services"
          :key="index"
          :ref="(el) => el && cardsRef.push(el as HTMLElement)"
          role="button"
          tabindex="0"
          :aria-label="`View ${service.title} service details`"
          @click="navigateTo(service.link)"
          @keydown.enter="navigateTo(service.link)"
          @keydown.space.prevent="navigateTo(service.link)"
        >
          <div
            class="card-image"
            :style="{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.605)), url(${service.image})`,
            }"
          ></div>
          <div class="card-content">
            <span class="service-tag">Service #{{ index + 1 }}</span>
            <h3 class="service-title" data-lang>{{ service.title }}</h3>
            <p class="service-desc" data-lang>{{ service.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .services-section {
    position: relative;
    padding: var(--spacing-12) var(--spacing-8);
    overflow: visible;
    min-height: 90vh;
  }

  .watermark {
    position: absolute;
    top: 25%;
    left: 42%;
    transform: translate(-50%, -50%);
    font-size: clamp(8rem, 20vw, 20rem);
    font-weight: 900;
    color: rgba(79, 78, 78, 0.4);
    line-height: 1;
    pointer-events: none;
    z-index: 0;
    white-space: nowrap;
    letter-spacing: -0.02em;
  }

  .services-container {
    position: relative;
    z-index: 1;
  }

  .services-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-16);
  }

  .section-title {
    font-size: var(--font-size-6xl);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-2);
    line-height: 1.2;
  }

  .section-subtitle {
    font-size: var(--font-size-lg);
    color: var(--color-text-secondary);
    font-weight: var(--font-weight-regular);
  }

  .slider-controls {
    display: flex;
    gap: var(--spacing-3);
  }

  .nav-button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #000;
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .nav-button:hover {
    background: #333;
    transform: scale(1.05);
  }

  .nav-button svg {
    width: 20px;
    height: 20px;
  }

  .cards-scroller {
    display: flex;
    gap: clamp(16px, 2.2vw, 32px);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .cards-scroller::-webkit-scrollbar {
    display: none;
  }

  .service-card {
    flex: 0 0 clamp(300px, 36vw, 500px);
    height: clamp(420px, 44vw, 620px);
    border-radius: var(--radius-xl);
    overflow: hidden;
    position: relative;
    scroll-snap-align: start;
    cursor: pointer;
    transition:
      transform 0.4s ease,
      box-shadow 0.4s ease;
    box-shadow:
      0px 1px 1px rgba(3, 7, 18, 0.02),
      0px 5px 4px rgba(3, 7, 18, 0.03),
      0px 12px 9px rgba(3, 7, 18, 0.05),
      0px 20px 15px rgba(3, 7, 18, 0.06),
      0px 32px 24px rgba(3, 7, 18, 0.08);
  }

  .service-card:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .card-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.6s ease;
  }

  .service-card:hover .card-image {
    transform: scale(1.08);
  }

  .card-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--spacing-10) var(--spacing-8) var(--spacing-8);
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(0, 0, 0, 0.7) 60%,
      rgba(0, 0, 0, 0) 100%
    );
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .service-tag {
    color: #ff6b35;
    font-weight: 600;
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    margin-bottom: var(--spacing-3);
    letter-spacing: 0.05em;
  }

  .service-title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--spacing-3);
    line-height: 1.2;
  }

  .service-desc {
    font-size: var(--font-size-sm);
    opacity: 0.9;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (max-width: 1200px) {
    .services-section {
      padding: var(--spacing-10) var(--spacing-6);
      min-height: auto;
    }

    .services-header {
      margin-bottom: var(--spacing-10);
    }

    .section-title {
      font-size: var(--font-size-5xl);
    }

    .service-card {
      flex-basis: clamp(300px, 52vw, 420px);
      height: clamp(400px, 56vw, 520px);
    }

    .card-content {
      padding: var(--spacing-8) var(--spacing-6) var(--spacing-6);
    }
  }

  @media (max-width: 768px) {
    .services-section {
      padding: var(--spacing-8) var(--spacing-4);
    }

    .watermark {
      top: 18%;
      left: 50%;
      font-size: clamp(4rem, 20vw, 7rem);
    }

    .services-header {
      flex-direction: column;
      gap: var(--spacing-4);
      align-items: flex-start;
      margin-bottom: var(--spacing-8);
    }

    .section-title {
      font-size: var(--font-size-4xl);
    }

    .service-card {
      flex: 0 0 min(84vw, 340px);
      height: clamp(360px, 105vw, 440px);
      scroll-snap-align: center;
    }

    .card-content {
      padding: var(--spacing-6) var(--spacing-5) var(--spacing-5);
    }

    .service-title {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--spacing-2);
    }

    .service-desc {
      -webkit-line-clamp: 3;
      line-clamp: 3;
      line-height: 1.5;
    }

    .slider-controls {
      align-self: flex-end;
    }
  }

  @media (max-width: 480px) {
    .services-section {
      padding: var(--spacing-6) var(--spacing-3);
    }

    .cards-scroller {
      --scroller-edge: var(--spacing-2);
      padding-top: var(--spacing-6);
      padding-bottom: var(--spacing-6);
    }

    .service-card {
      flex-basis: min(88vw, 320px);
      height: clamp(340px, 112vw, 400px);
      border-radius: var(--radius-lg);
    }

    .nav-button {
      width: 40px;
      height: 40px;
    }

    .nav-button svg {
      width: 18px;
      height: 18px;
    }
  }
</style>
