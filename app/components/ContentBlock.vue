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
          <div :ref="(el) => el && statsRef.push(el)" class="stat-item">
            <span class="stat-number">25+</span>
            <span class="stat-label">Clients</span>
          </div>
          <div :ref="(el) => el && statsRef.push(el)" class="stat-item">
            <span class="stat-number">70+</span>
            <span class="stat-label">Projects Delivered</span>
          </div>
          <div :ref="(el) => el && statsRef.push(el)" class="stat-item">
            <span class="stat-number">99%</span>
            <span class="stat-label">Happy Clients</span>
          </div>
        </div>

        <div class="inverted about-page">
          <div class="title">
            <span ref="titleRef" class="page-title">About Company</span>
            <h1 ref="mainTitleRef" class="main-title">Deliver the best technology solution</h1>
            <p ref="descRef" class="desc">
              We focused on end to end IT solution to help a company improve their capabilities in
              facing today business challenges with technology.
            </p>
          </div>
          <div class="services-summary">
            <div :ref="(el) => el && servicesRef.push(el)" class="service-item">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Build</span>
            </div>
            <div :ref="(el) => el && servicesRef.push(el)" class="service-item">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" stroke-width="2" />
                <path d="m21 21-4.35-4.35" stroke-width="2" stroke-linecap="round" />
              </svg>
              <span>Research</span>
            </div>
            <div :ref="(el) => el && servicesRef.push(el)" class="service-item">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
              <span>Develop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  const sectionRef = ref(null);
  const statsRef = ref([]);
  const titleRef = ref(null);
  const mainTitleRef = ref(null);
  const descRef = ref(null);
  const servicesRef = ref([]);

  const { initAnimations, cleanup } = useContentBlockAnimations();

  // Clear array refs before each render
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

<style scoped>
  .content-block {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: end;
    padding: var(--spacing-32) 0;
    position: relative;
    overflow: hidden;
  }

  .container {
    position: relative;
    z-index: 1;
  }

  .wrapper {
    position: relative;
  }

  .company-summary {
    position: absolute;
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    right: 2%;
    bottom: 0;
  }

  .company-summary .stat-item {
    display: flex;
    flex-direction: column;
    text-transform: capitalize;
    text-align: center;
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-thin);
  }

  .company-summary .stat-item .stat-number {
    font-size: calc(var(--font-size-2xl) * 2);
    font-weight: var(--font-weight-regular);
  }

  .inverted {
    clip-path: url("#clip");
    width: 100%;
    height: 540px;
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.605)), url("~/assets/images/Vector.png");
    background-size: cover;
    background-position: center;
    aspect-ratio: 460 / 127;
    color: var(--color-text-inverse);
    padding: var(--spacing-lg);
    border-radius: 50px;
    position: relative;
    outline: 2px solid white;
  }

  .page-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-regular);
    color: var(--color-surface-alt);
  }

  .main-title {
    font-size: var(--font-size-6xl);
    font-weight: var(--font-weight-regular);
    width: 40%;
    text-transform: capitalize;
  }

  .desc {
    margin-top: var(--spacing-sm);
    width: 40%;
    font-size: var(--font-size-xl);
  }

  .services-summary {
    color: white;
  }

  .services-summary {
    display: flex;
    gap: var(--spacing-xl);
    margin-top: auto;
  }

  .service-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-10);
    font-size: var(--font-size-2xl);
  }

  .icon {
    width: 2.5rem;
    height: 2.5rem;
    stroke: currentColor;
    color: white;
  }

  .inverted {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .company-summary {
      grid-template-columns: 1fr;
      gap: var(--spacing-8);
    }

    .stat-number {
      font-size: var(--font-size-5xl);
    }
  }
</style>
