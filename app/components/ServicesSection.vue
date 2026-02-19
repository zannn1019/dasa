<template>
  <section class="services-section" ref="sectionRef">
    <!-- Watermark Background -->
    <div class="watermark" ref="watermarkRef">SERVICES</div>

    <div class="container services-container">
      <div class="services-header" ref="headerRef">
        <div class="header-text">
          <h2 class="section-title" ref="titleRef">Services</h2>
          <p class="section-subtitle" ref="subtitleRef">What we deliver to customers</p>
        </div>

        <div class="slider-controls" ref="controlsRef">
          <button @click="scroll('left')" class="nav-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M15 18l-6-6 6-6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button @click="scroll('right')" class="nav-button">
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

      <!-- Scroll Container -->
      <div class="cards-scroller" ref="scroller">
        <div
          class="service-card"
          v-for="(service, index) in services"
          :key="index"
          :ref="
            (el) => {
              if (el) cardsRef[index] = el as HTMLElement;
            }
          "
        >
          <div
            class="card-image"
            :style="{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.605)), url(${service.image})`,
            }"
          ></div>
          <div class="card-content">
            <span class="service-tag">Service #{{ index + 1 }}</span>
            <h3 class="service-title">{{ service.title }}</h3>
            <p class="service-desc">{{ service.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useServicesAnimations } from "~/composables/useServicesAnimations";
  import img1 from "~/assets/images/service-1.png";
  import img2 from "~/assets/images/service-2.png";
  import img3 from "~/assets/images/service-3.png";
  import img4 from "~/assets/images/service-4.png";

  const services = [
    {
      title: "Dev Ops",
      desc: "Streamline your development lifecycle with automated CI/CD pipelines, containerization, and robust cloud infrastructure management.",
      image: img1,
    },
    {
      title: "Data Integration",
      desc: "Connect and synchronize disparate data sources into a unified, reliable stream of information for your business processes.",
      image: img2,
    },
    {
      title: "Database Platform",
      desc: "Design and optimize high-performance database systems that ensure data integrity, security, and high availability.",
      image: img3,
    },
    {
      title: "Development",
      desc: "Build scalable, robust applications using modern frameworks and industry best practices tailored to your specific requirements.",
      image: img4,
    },
  ];

  const sectionRef = ref<HTMLElement | null>(null);
  const watermarkRef = ref<HTMLElement | null>(null);
  const headerRef = ref<HTMLElement | null>(null);
  const titleRef = ref<HTMLElement | null>(null);
  const subtitleRef = ref<HTMLElement | null>(null);
  const controlsRef = ref<HTMLElement | null>(null);
  const scroller = ref<HTMLElement | null>(null);
  const cardsRef = ref<HTMLElement[]>([]);

  const { initAnimations, createCardHoverEffect, animateNavButtons } = useServicesAnimations();

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

  function scroll(direction: "left" | "right") {
    if (!scroller.value) return;
    const scrollAmount = 320; // Card width + gap
    if (direction === "left") {
      scroller.value.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      scroller.value.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }
</script>

<style scoped>
  .services-section {
    position: relative;
    padding: var(--spacing-16);
    overflow: visible;
    height: 90vh;
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

  /* Cards Scroller */
  .cards-scroller {
    display: flex;
    gap: var(--spacing-8);
    overflow-x: auto;
    padding: var(--spacing-20) var(--spacing-4) var(--spacing-20);
    margin: calc(-1 * var(--spacing-20)) calc(-1 * var(--spacing-4));
    scroll-snap-type: x mandatory;
    width: 100%;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .cards-scroller::-webkit-scrollbar {
    display: none;
  }

  .service-card {
    flex: 0 0 500px;
    height: 620px;
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
    /* transform: translateY(-8px); */
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

  @media (max-width: 768px) {
    .services-header {
      flex-direction: column;
      gap: var(--spacing-6);
      align-items: flex-start;
    }

    .section-title {
      font-size: var(--font-size-4xl);
    }

    .service-card {
      flex: 0 0 300px;
      height: 380px;
    }

    .slider-controls {
      align-self: flex-end;
    }
  }
</style>
