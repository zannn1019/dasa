<script setup lang="ts">

  definePageMeta({
    layout: "default",
    footerConnector: false,
  });

  const route = useRoute();
  const { getPageData, getAbsoluteImageUrl } = useCms();

  const slug = route.params.service as string;

  const { data: siteResponse } = await getPageData("site-setting");
  const siteData = computed(() => {
    const raw = Array.isArray(siteResponse.value?.data) ? siteResponse.value?.data[0] : siteResponse.value?.data;
    return (raw?.attributes ?? raw ?? {}) as any;
  });

  const { data: servicesResponse } = await getPageData("services", {
    subServices: true,
    technologies: true,
    image: true,
  });

  const allServices = computed(() => {
    const raw = (servicesResponse.value as any)?.data ?? [];
    return [...raw]
      .sort((a: any, b: any) => {
        const aOrder = a.attributes?.order ?? a.order ?? 0;
        const bOrder = b.attributes?.order ?? b.order ?? 0;
        return aOrder - bOrder;
      })
      .map((item: any) => {
        const attrs = item.attributes ?? item;
        return {
          title: attrs.title,
          description: attrs.description,
          overview: attrs.overview,
          slug: attrs.slug,
          order: attrs.order,
          image: getAbsoluteImageUrl(attrs.image?.data?.attributes?.url ?? attrs.image?.url),
          link: `/services/${attrs.slug}`,
          subServices: (attrs.subServices ?? []).map((s: any) => ({
            title: s.title,
            description: s.description,
          })),
          technologies: (attrs.technologies ?? []).map((t: any) => t.name),
        };
      });
  });

  const serviceIndex = computed(() => allServices.value.findIndex((s) => s.slug === slug));
  const service = computed(() => allServices.value[serviceIndex.value]);
  const prevService = computed(() =>
    serviceIndex.value > 0 ? allServices.value[serviceIndex.value - 1] : null,
  );
  const nextService = computed(() =>
    serviceIndex.value < allServices.value.length - 1
      ? allServices.value[serviceIndex.value + 1]
      : null,
  );
  const serviceNumber = computed(() =>
    serviceIndex.value >= 0 ? String(serviceIndex.value + 1).padStart(2, "0") : "01",
  );

  if (!service.value) {
    throw createError({ statusCode: 404, statusMessage: "Service not found" });
  }

  useSeo({ title: service.value?.title ?? "", description: service.value?.description ?? "" });
  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.value?.title,
          description: service.value?.description,
          provider: { "@type": "Organization", name: siteData.value.name, url: siteData.value.siteUrl },
          url: `${siteData.value.siteUrl}/services/${slug}`,
        }),
      },
    ],
  });

  const pageRootRef = ref<HTMLElement | null>(null);
  const heroTaglineRef = ref<HTMLElement | null>(null);
  const heroTitleRef = ref<HTMLElement | null>(null);
  const heroNumRef = ref<HTMLElement | null>(null);
  const heroDescRef = ref<HTMLElement | null>(null);
  const heroDividerRef = ref<HTMLElement | null>(null);
  const overviewTextRef = ref<HTMLElement | null>(null);
  const overviewNumRef = ref<HTMLElement | null>(null);
  const capsGridRef = ref<HTMLElement | null>(null);
  const ctaTextRef = ref<HTMLElement | null>(null);

  const { init, cleanup } = useServiceDetailAnimations();

  onMounted(() => {
    nextTick(() => {
      init({
        pageRootRef,
        heroTaglineRef,
        heroTitleRef,
        heroNumRef,
        heroDescRef,
        heroDividerRef,
        overviewTextRef,
        overviewNumRef,
        capsGridRef,
        ctaTextRef,
      });
    });
  });

  onUnmounted(() => cleanup());
</script>

<template>
  <div class="sd" ref="pageRootRef">
    <section class="sd-hero">
      <div class="sd-hero__bg">
        <div class="sd-hero__gradient" />
        <div class="sd-hero__grid" />
      </div>

      <div class="container sd-hero__body">
        <div class="sd-hero__topbar">
          <span ref="heroTaglineRef" class="sd-hero__eyebrow">Our Services</span>
          <span ref="heroDividerRef" class="sd-hero__divider" />
          <span class="sd-hero__total">{{ serviceIndex + 1 }} / {{ allServices.length }}</span>
        </div>

        <div class="sd-hero__main">
          <div class="sd-hero__num-wrap">
            <span ref="heroNumRef" class="sd-hero__num">{{ serviceNumber }}</span>
          </div>
          <div class="sd-hero__title-wrap">
            <h1 ref="heroTitleRef" class="sd-hero__title" data-lang>
              {{ service?.title }}
            </h1>
          </div>
        </div>

        <div class="sd-hero__foot">
          <div class="sd-hero__foot-rule" />
          <p ref="heroDescRef" class="sd-hero__desc" data-lang>{{ service?.description }}</p>
          <NuxtLink to="#capabilities" class="sd-hero__explore">
            <span>Explore</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="sd-overview">
      <div class="container sd-overview__inner">
        <div class="sd-overview__stat">
          <span class="sd-overview__stat-num" ref="overviewNumRef">
            {{ Number(allServices.length) * 6 }}+
          </span>
          <span class="sd-overview__stat-label">Projects delivered</span>
        </div>
        <p ref="overviewTextRef" class="sd-overview__text" data-lang>
          {{ service?.overview }}
        </p>
      </div>
    </section>

    <section id="capabilities" class="sd-caps">
      <div class="container">
        <header class="sd-caps__header">
          <h2 class="sd-caps__heading">
            What we
            <br />
            <em>deliver</em>
          </h2>
        </header>

        <div class="sd-caps__grid" ref="capsGridRef">
          <article v-for="(sub, i) in service?.subServices" :key="i" class="sd-cap-card">
            <div class="sd-cap-card__index">{{ String(Number(i) + 1).padStart(2, "0") }}</div>
            <div class="sd-cap-card__body">
              <h3 class="sd-cap-card__title" data-lang>{{ sub.title }}</h3>
              <p class="sd-cap-card__desc" data-lang>{{ sub.description }}</p>
            </div>
            <div class="sd-cap-card__accent" />
          </article>
        </div>
      </div>
    </section>

    <section v-if="service?.technologies?.length" class="sd-tech">
      <div class="sd-tech__label-row container">
        <span class="sd-label">Technology Stack</span>
      </div>
      <div class="sd-tech__marquee">
        <div class="marquee-track" aria-hidden="false">
          <span v-for="tech in service?.technologies" :key="tech" class="marquee-item">
            <span class="marquee-dot" />
            {{ tech }}
          </span>
        </div>
        <div class="marquee-track" aria-hidden="true">
          <span v-for="tech in service?.technologies" :key="`dup-${tech}`" class="marquee-item">
            <span class="marquee-dot" />
            {{ tech }}
          </span>
        </div>
      </div>
    </section>

    <section class="sd-cta">
      <div class="container">
        <div class="sd-cta__box">
          <div class="sd-cta__border" />
          <div class="sd-cta__content">
            <h2 ref="ctaTextRef" class="sd-cta__title">
              <span class="word">Let's</span>
              <span class="word">build</span>
              <span class="word word--italic">something</span>
              <br />
              <span class="word">great</span>
              <span class="word">together</span>
            </h2>
            <p class="sd-cta__desc">
              Don't let technology become a barrier.
              <br />
              Partner with DASA to move faster.
            </p>
            <BaseButton
              variant="primary"
              size="lg"
              radius="sm"
              to="/about#contact"
              class="sd-cta__btn"
            >
              Connect with us →
            </BaseButton>
          </div>
          <div class="sd-cta__deco" data-lang>{{ service?.title }}</div>
        </div>
      </div>
    </section>

    <nav class="sd-nav">
      <div class="container sd-nav__inner">
        <NuxtLink v-if="prevService" :to="prevService.link" class="sd-nav__item sd-nav__item--prev">
          <span class="sd-nav__dir">← Prev</span>
          <span class="sd-nav__name">{{ prevService?.title }}</span>
        </NuxtLink>
        <div v-else />

        <div class="sd-nav__pip">
          <span
            v-for="(_, i) in allServices"
            :key="i"
            class="sd-nav__dot"
            :class="{ active: i === serviceIndex }"
          />
        </div>

        <NuxtLink v-if="nextService" :to="nextService.link" class="sd-nav__item sd-nav__item--next">
          <span class="sd-nav__dir">Next →</span>
          <span class="sd-nav__name">{{ nextService?.title }}</span>
        </NuxtLink>
        <div v-else />
      </div>
    </nav>
  </div>
</template>

<style scoped>
  .sd {
    --orange: var(--color-brand-orange-darker);
    --dark: #08090c;
    --mono: var(--font-mono);
  }

  .sd-hero {
    position: relative;
    min-height: 50svh;
    display: flex;
    align-items: stretch;
    background: var(--dark);
    color: #fff;
    overflow: hidden;
    border-radius: 0 0 48px 48px;
  }

  .sd-hero__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .sd-hero__gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 15% 50%, rgba(238, 93, 34, 0.22) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 85% 10%, rgba(238, 93, 34, 0.1) 0%, transparent 60%);
  }

  .sd-hero__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .sd-hero__body {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: clamp(32px, 4vw, 64px);
    padding-top: clamp(100px, 14vw, 160px);
    padding-bottom: clamp(56px, 7vw, 100px);
  }

  .sd-hero__topbar {
    display: flex;
    align-items: center;
    gap: var(--spacing-6);
  }

  .sd-hero__eyebrow {
    font-family: var(--mono);
    font-size: var(--font-size-xs);
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--orange);
    white-space: nowrap;
  }

  .sd-hero__divider {
    flex: 1;
    max-width: 120px;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    display: block;
  }

  .sd-hero__total {
    font-family: var(--mono);
    font-size: var(--font-size-xs);
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 2px;
  }

  .sd-hero__main {
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-4);
  }

  .sd-hero__num-wrap {
    line-height: 1;
    padding-bottom: 0.15em;
  }

  .sd-hero__num {
    font-family: var(--mono);
    font-size: clamp(2.5rem, 1.5rem + 6vw, 8rem);
    font-weight: 700;
    color: var(--orange);
    line-height: 1;
    display: block;
  }

  .sd-hero__title-wrap {
    flex: 1;
  }

  .sd-hero__title {
    font-size: clamp(2.8rem, 1.2rem + 7vw, 9rem);
    font-weight: 200;
    letter-spacing: -0.03em;
    line-height: 0.95;
    margin: 0;
    text-wrap: balance;
  }

  .sd-hero__foot {
    display: grid;
    grid-template-columns: 1px 1fr auto;
    align-items: start;
    gap: clamp(20px, 3vw, 48px);
  }

  .sd-hero__foot-rule {
    grid-row: 1 / 3;
    align-self: stretch;
    width: 1px;
    background: rgba(255, 255, 255, 0.15);
    margin-top: 4px;
  }

  .sd-hero__desc {
    font-size: clamp(1rem, 0.85rem + 0.5vw, 1.25rem);
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
    max-width: 55ch;
  }

  .sd-hero__explore {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-3);
    text-decoration: none;
    color: rgba(255, 255, 255, 0.4);
    font-family: var(--mono);
    font-size: var(--font-size-xs);
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: color 0.3s;
    animation: exploreBob 2.5s ease-in-out infinite;
    padding-top: var(--spacing-2);
    grid-column: 3;
  }

  .sd-hero__explore:hover {
    color: var(--orange);
  }

  @keyframes exploreBob {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(6px);
    }
  }

  .sd-overview {
    padding: clamp(64px, 10vw, 140px) 0;
  }

  .sd-overview__inner {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: clamp(32px, 5vw, 80px);
    align-items: start;
  }

  .sd-overview__stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 140px;
  }

  .sd-overview__stat-num {
    font-size: clamp(3rem, 2rem + 3vw, 5.5rem);
    font-weight: 700;
    color: var(--orange);
    line-height: 1;
    font-family: var(--mono);
  }

  .sd-overview__stat-label {
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--color-text-secondary);
    font-family: var(--mono);
  }

  .sd-overview__text {
    font-size: clamp(1.1rem, 0.9rem + 0.6vw, 1.4rem);
    line-height: 1.85;
    color: #374151;
    font-weight: 400;
    margin: 0;
    padding-top: var(--spacing-3);
    border-top: 1px solid var(--color-border-default);
  }

  .sd-caps {
    padding: 0 0 clamp(64px, 10vw, 140px);
  }

  .sd-label {
    font-family: var(--mono);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 4px;
    color: var(--orange);
    display: block;
  }

  .sd-caps__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: clamp(40px, 6vw, 80px);
  }

  .sd-caps__heading {
    font-size: clamp(2.5rem, 1.5rem + 4vw, 6rem);
    font-weight: 200;
    letter-spacing: -0.03em;
    line-height: 1;
    margin: 0;
    text-align: right;
  }

  .sd-caps__heading em {
    font-style: italic;
    color: var(--orange);
  }

  .sd-caps__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: var(--color-border-default);
    border: 1px solid var(--color-border-default);
    border-radius: 24px;
    overflow: hidden;
  }

  .sd-cap-card {
    background: #fff;
    padding: clamp(24px, 3vw, 48px);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-6);
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
  }

  .sd-cap-card:hover {
    background: #fafafa;
  }

  .sd-cap-card:hover .sd-cap-card__accent {
    opacity: 1;
    transform: scaleX(1);
  }

  .sd-cap-card__accent {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--orange), var(--color-brand-orange));
    transform: scaleX(0);
    transform-origin: left;
    transition:
      transform 0.4s ease,
      opacity 0.4s;
    opacity: 0;
  }

  .sd-cap-card__index {
    font-family: var(--mono);
    font-size: var(--font-size-xs);
    color: var(--orange);
    letter-spacing: 3px;
  }

  .sd-cap-card__title {
    font-size: clamp(1.1rem, 0.9rem + 0.8vw, 1.6rem);
    font-weight: 500;
    line-height: 1.2;
    margin: 0;
    color: var(--color-text-primary);
  }

  .sd-cap-card__desc {
    font-size: clamp(15px, 0.875rem + 0.3vw, 17px);
    line-height: 1.75;
    color: #374151;
    font-weight: 400;
    margin: 0;
    flex: 1;
  }

  .sd-tech {
    padding: clamp(40px, 6vw, 80px) 0;
    overflow: hidden;
    border-top: 1px solid var(--color-border-default);
    border-bottom: 1px solid var(--color-border-default);
  }

  .sd-tech__label-row {
    margin-bottom: var(--spacing-8);
  }

  .sd-tech__marquee {
    display: flex;
    white-space: nowrap;
    gap: 0;
    cursor: default;
  }

  .marquee-track {
    display: flex;
    align-items: center;
    gap: clamp(24px, 3vw, 56px);
    flex-shrink: 0;
    padding-right: clamp(24px, 3vw, 56px);
  }

  .marquee-item {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-4);
    font-size: clamp(1rem, 0.8rem + 0.8vw, 1.5rem);
    font-weight: 300;
    color: var(--color-text-secondary);
    font-family: var(--mono);
    transition: color 0.2s;
  }

  .marquee-item:hover {
    color: var(--orange);
  }

  .marquee-dot {
    width: 9px;
    height: 9px;
    background: var(--orange);
    border-radius: 50%;
    flex-shrink: 0;
    opacity: 1;
    box-shadow: 0 0 6px rgba(238, 93, 34, 0.5);
  }

  /* Pure CSS marquee — no JS cloning, no zombie tweens after navigation */
  @keyframes marquee-scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-100%);
    }
  }

  .marquee-track {
    animation: marquee-scroll 20s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee-track {
      animation-play-state: paused;
    }
  }

  .sd-cta {
    padding: clamp(40px, 6vw, 80px) 0 clamp(64px, 10vw, 120px);
  }

  .sd-cta__box {
    position: relative;
    background: var(--dark);
    border-radius: 40px;
    padding: clamp(48px, 6vw, 100px) clamp(32px, 5vw, 80px);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 360px;
  }

  .sd-cta__border {
    position: absolute;
    inset: 0;
    border-radius: 40px;
    border: 1px solid transparent;
    background:
      linear-gradient(var(--dark), var(--dark)) padding-box,
      linear-gradient(135deg, var(--orange) 0%, transparent 50%, var(--orange) 100%) border-box;
    animation: borderRotate 6s linear infinite;
    background-size: 200% 200%;
  }

  @keyframes borderRotate {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .sd-cta__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-8);
    max-width: 600px;
  }

  .sd-cta__title {
    font-size: clamp(2.5rem, 1.5rem + 4vw, 5.5rem);
    font-weight: 200;
    color: #fff;
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  .word {
    display: inline-block;
    margin-right: 0.25em;
  }

  .word--italic {
    font-style: italic;
    color: var(--orange);
  }

  .sd-cta__desc {
    font-size: var(--font-size-lg);
    color: rgba(255, 255, 255, 0.45);
    margin: 0;
    line-height: 1.7;
  }

  .sd-cta__deco {
    position: absolute;
    right: clamp(-16px, -2vw, -32px);
    top: 50%;
    transform: translateY(-50%);
    font-size: clamp(4rem, 3rem + 8vw, 12rem);
    font-weight: 900;
    color: rgba(255, 255, 255, 0.04);
    letter-spacing: -0.04em;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }

  .sd-nav {
    padding: clamp(32px, 4vw, 64px) 0 clamp(48px, 8vw, 100px);
  }

  .sd-nav__inner {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--spacing-8);
  }

  .sd-nav__item {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    transition: opacity 0.25s;
  }

  .sd-nav__item:hover {
    opacity: 0.6;
  }

  .sd-nav__item--next {
    align-items: flex-end;
  }

  .sd-nav__dir {
    font-family: var(--mono);
    font-size: var(--font-size-xs);
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--orange);
  }

  .sd-nav__name {
    font-size: clamp(1.5rem, 1rem + 2vw, 3rem);
    font-weight: 200;
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
    line-height: 1.1;
  }

  .sd-nav__pip {
    display: flex;
    gap: var(--spacing-2);
    align-items: center;
  }

  .sd-nav__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-border-default);
    transition: all 0.3s ease;
  }

  .sd-nav__dot.active {
    background: var(--orange);
    transform: scale(1.5);
  }

  @media (max-width: 1024px) {
    .sd-hero {
      border-radius: 0 0 32px 32px;
    }

    .sd-hero__foot {
      grid-template-columns: 1px 1fr;
    }
    .sd-hero__explore {
      display: none;
    }

    .sd-overview__inner {
      grid-template-columns: 1fr;
      gap: var(--spacing-8);
    }

    .sd-caps__header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-4);
    }
    .sd-caps__heading {
      text-align: left;
    }

    .sd-cta__box {
      flex-direction: column;
      align-items: flex-start;
      min-height: auto;
    }
    .sd-cta__deco {
      display: none;
    }

    .sd-nav__inner {
      grid-template-columns: 1fr 1fr;
    }
    .sd-nav__pip {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .sd-hero {
      border-radius: 0 0 24px 24px;
    }
    .sd-hero__main {
      flex-direction: column;
      align-items: flex-start;
    }
    .sd-hero__num {
      font-size: clamp(2rem, 10vw, 4rem);
    }

    .sd-caps__grid {
      grid-template-columns: 1fr;
      border-radius: 16px;
    }

    .sd-nav__inner {
      grid-template-columns: 1fr;
    }
    .sd-nav__item--next {
      align-items: flex-start;
    }

    .sd-cta__box {
      border-radius: 24px;
    }
  }
</style>
