<script setup lang="ts">
  const { getPageData } = useCms();

  const { data: aboutDataResponse } = await getPageData('about-section',{
    stats: {
      populate: "*"
    },
    capabilities: {
      populate: "*"
    }
  });
  
  const content = computed(() => {
    const raw = Array.isArray(aboutDataResponse.value?.data) 
      ? aboutDataResponse.value?.data?.[0]
      : aboutDataResponse.value?.data;
    
    return {
      sectionTitle: (raw?.sectionTitle as any) || '',
      title: (raw?.title as any) || '',
      description: (raw?.description as any) || '',
      stats: ((raw?.stats as any) || []).map((s: any) => ({ number: s.number, label: s.label })),
      capabilities: ((raw?.capabilities as any) || []).map((c: any) => ({ icon: c.icon, label: c.label })),
    };
  });

  const sectionRef = ref<HTMLElement | null>(null);
  const statsRef = ref<HTMLElement[]>([]);
  const titleRef = ref<HTMLElement | null>(null);
  const mainTitleRef = ref<HTMLElement | null>(null);
  const descRef = ref<HTMLElement | null>(null);
  const servicesRef = ref<HTMLElement[]>([]);

  const { initAnimations, cleanup } = useContentBlockAnimations();

  onBeforeUpdate(() => {
    statsRef.value = [];
    servicesRef.value = [];
  });

  onMounted(() => {
    initAnimations({
      sectionRef,
      statsRef,
      titleRef,
      mainTitleRef,
      descRef,
      servicesRef,
    });
  });

  onUnmounted(() => {
    cleanup();
  });
</script>

<template>
  <section ref="sectionRef" class="content-block">
    <div class="container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style="display: block; position: absolute"
        width="0"
        height="0"
      >
        <defs>
          <clipPath id="clip" clipPathUnits="objectBoundingBox">
            <path
              d="M0.0272,0H0.9728A0.0272,0.0984,0,0,1,1,0.0984V0.5079A0.0272,0.0984,0,0,1,0.9728,0.6063H0.5924A0.0272,0.0984,0,0,0,0.5652,0.7047V0.9016A0.0272,0.0984,0,0,1,0.538,1H0.0272A0.0272,0.0984,0,0,1,0,0.9016V0.0984A0.0272,0.0984,0,0,1,0.0272,0Z"
            />
          </clipPath>
        </defs>
      </svg>
      <div class="wrapper">
        <div class="company-summary">
          <div
            v-for="(stat, index) in content.stats"
            :key="index"
            :ref="(el) => el && statsRef.push(el as HTMLElement)"
            class="stat-item"
          >
            <span class="stat-number">{{ stat.number }}</span>
            <span class="stat-label" data-lang>{{ stat.label }}</span>
          </div>
        </div>

        <div class="inverted about-page">
          <div class="title">
            <span ref="titleRef" class="page-title" data-lang>{{ content.sectionTitle }}</span>
            <h2 ref="mainTitleRef" class="main-title" data-lang>{{ content.title }}</h2>
            <p ref="descRef" class="desc" data-lang>
              {{ content.description }}
            </p>
          </div>
          <div class="services-summary">
            <div
              v-for="(capability, index) in content.capabilities"
              :key="index"
              :ref="(el) => el && servicesRef.push(el as HTMLElement)"
              class="service-item"
            >
              <svg
                v-if="capability.icon === 'wrench'"
                class="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                v-else-if="capability.icon === 'search'"
                class="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" stroke-width="2" />
                <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round" />
              </svg>
              <svg
                v-else-if="capability.icon === 'code'"
                class="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polyline
                  points="16 18 22 12 16 6"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <polyline
                  points="8 6 2 12 8 18"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span data-lang>{{ capability.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .content-block {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(32px, 5vw, 96px) 0;
    position: relative;
    overflow: hidden;
  }

  .container {
    position: relative;
    z-index: 1;
  }

  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column-reverse;
    width: 100%;
  }

  .company-summary {
    position: absolute;
    display: flex;
    align-items: center;
    gap: clamp(20px, 3.2vw, 48px);
    padding: clamp(14px, 2vw, 24px) clamp(18px, 2.8vw, 36px);
    right: clamp(18px, 3vw, 180px);
    bottom: clamp(8px, 1.6vw, 24px);
    background: var(--color-surface-base);
    border-radius: var(--radius-2xl) var(--radius-2xl) 0px 0px;
    z-index: 3;
  }

  .company-summary .stat-item {
    display: flex;
    flex-direction: column;
    text-transform: capitalize;
    text-align: center;
    font-size: clamp(12px, 0.72rem + 0.35vw, 16px);
    font-weight: var(--font-weight-thin);
    line-height: 1.3;
  }

  .company-summary .stat-item .stat-number {
    font-size: clamp(24px, 1.2rem + 1.6vw, 42px);
    font-weight: var(--font-weight-regular);
    color: var(--color-text-primary);
  }

  .inverted {
    display: flex;
    flex-direction: column;
    width: 97%;
    min-height: clamp(320px, 38vw, 460px);
    clip-path: url("#clip");
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.605)), url("/images/Vector.webp");
    background-size: cover;
    background-position: center;
    color: var(--color-text-inverse);
    padding: clamp(18px, 2.8vw, 44px);
    position: relative;
  }

  .page-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-regular);
    color: var(--color-surface-alt);
  }

  .main-title {
    font-size: clamp(2rem, 1.3rem + 2.4vw, 3.7rem);
    font-weight: var(--font-weight-regular);
    width: min(60%, 760px);
    text-transform: capitalize;
    line-height: 1.15;
  }

  .desc {
    margin-top: var(--spacing-sm);
    width: min(56%, 720px);
    font-size: clamp(13px, 0.78rem + 0.5vw, 20px);
    line-height: 1.5;
  }

  .services-summary {
    display: flex;
    gap: clamp(16px, 2vw, 42px);
    margin-top: auto;
    color: white;
    flex-wrap: wrap;
  }

  .service-item {
    display: flex;
    align-items: center;
    gap: clamp(8px, 1.2vw, 16px);
    font-size: clamp(12px, 0.72rem + 0.5vw, 22px);
    flex-wrap: wrap;
  }

  .icon {
    width: 2.5rem;
    height: 2.5rem;
    stroke: currentColor;
    color: white;
  }

  @media (max-width: 1366px) {
    .container {
      padding: 0;
    }

    .main-title {
      width: min(70%, 760px);
    }

    .desc {
      width: min(68%, 680px);
    }

    .services-summary {
      margin-right: 260px;
    }
  }

  @media (max-width: 1024px) {
    .inverted {
      clip-path: none;
      border-radius: var(--radius-2xl);
    }

    .company-summary {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-around;
      right: 0;
      bottom: 0;
    }

    .main-title,
    .desc {
      width: 100%;
      max-width: 760px;
    }

    .services-summary {
      margin-right: 0;
      margin-top: var(--spacing-8);
    }
  }

  @media (max-width: 768px) {
    .content-block {
      padding: var(--spacing-8) 0;
    }

    .main-title {
      font-size: clamp(1.8rem, 1.15rem + 2.8vw, 2.4rem);
    }

    .desc {
      font-size: var(--font-size-sm);
    }

    .company-summary {
      width: 100%;
      justify-content: space-between;
      margin-top: var(--spacing-4);
      padding: var(--spacing-3) var(--spacing-4);
      border-radius: var(--radius-xl);
      gap: var(--spacing-3);
    }

    .company-summary .stat-item {
      font-size: 11px;
      flex: 1;
      min-width: 0;
    }

    .company-summary .stat-item .stat-number {
      font-size: clamp(20px, 1rem + 1.6vw, 30px);
    }

    .services-summary {
      gap: var(--spacing-4);
      margin-top: var(--spacing-6);
    }

    .service-item {
      font-size: var(--font-size-base);
      gap: var(--spacing-2);
    }

    .icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    .page-title {
      font-size: var(--font-size-base);
    }

    .main-title {
      font-size: clamp(1.55rem, 1.2rem + 2.4vw, 2rem);
    }

    .desc {
      font-size: var(--font-size-xs);
      margin-top: var(--spacing-2);
    }

    .company-summary {
      padding: var(--spacing-2) var(--spacing-3);
      gap: var(--spacing-2);
    }

    .company-summary .stat-item .stat-number {
      font-size: clamp(18px, 0.9rem + 1.5vw, 24px);
    }

    .services-summary {
      gap: var(--spacing-3);
      justify-content: space-between;
    }

    .service-item {
      font-size: var(--font-size-sm);
    }
  }
</style>
