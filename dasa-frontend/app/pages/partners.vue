<script setup lang="ts">
  const { getPageData } = useCms();

  definePageMeta({ layout: "default" });

  useSeo({
    title: "Partners",
    description:
      "DASA partners with world-class technology vendors across database, big data, DevOps, and monitoring to deliver end-to-end IT solutions.",
    keywords: "technology partners, IT vendors, DevOps, big data, database solutions",
  });

  const { data: partnersResponse } = await getPageData("partners", {
    pagination: { pageSize: 100, page: 1 },
    sort: ["category:asc", "name:asc"],
  });

  const allPartners = computed(() => {
    const raw = (partnersResponse.value as any)?.data ?? [];
    return raw.map((item: any) => item.attributes ?? item);
  });

  const categories = computed(() => {
    const catsMap = new Map();
    for (const p of allPartners.value) {
      if (!catsMap.has(p.category)) {
        catsMap.set(p.category, { category: p.category, items: [] });
      }
      catsMap.get(p.category).items.push(p);
    }
    return Array.from(catsMap.values());
  });

  const totalPartners = computed(() => allPartners.value.length);

  const pageRef = ref<HTMLElement | null>(null);
  const heroTagRef = ref<HTMLElement | null>(null);
  const heroTitleRef = ref<HTMLElement | null>(null);
  const heroDescRef = ref<HTMLElement | null>(null);
  const heroDividerRef = ref<HTMLElement | null>(null);
  const marqueeRef = ref<HTMLElement | null>(null);

  const { init, cleanup } = usePartnersPageAnimations();

  onMounted(() => {
    nextTick(() => {
      init({ pageRef, heroTagRef, heroTitleRef, heroDescRef, heroDividerRef, marqueeRef });
    });
  });

  onUnmounted(() => cleanup());
</script>

<template>
  <div ref="pageRef" class="pp">
    <section class="pp-hero">
      <div class="pp-hero__bg">
        <div class="pp-hero__gradient" />
        <div class="pp-hero__grid" />
      </div>

      <div class="pp-hero__watermark" aria-hidden="true">Partners</div>

      <div class="container pp-hero__body">
        <div class="pp-hero__head">
          <span ref="heroTagRef" class="pp-label">Technology Partners</span>
          <div ref="heroDividerRef" class="pp-hero__divider" />
        </div>

        <h1 ref="heroTitleRef" class="pp-hero__title">
          Powered by the
          <br />
          <em>best</em>
          in tech
        </h1>

        <p ref="heroDescRef" class="pp-hero__desc">
          Together with world-class technology partners — market leaders and innovators — we deliver
          the best specialized skills and cutting-edge solutions.
        </p>

        <div class="pp-hero__stats">
          <div
            v-for="stat in [
              { num: totalPartners + '+', label: 'Technology partners' },
              { num: categories.length + '+', label: 'Solution categories' },
            ]"
            :key="stat.label"
            class="pp-hero__stat"
          >
            <span class="pp-hero__stat-num">{{ stat.num }}</span>
            <span class="pp-hero__stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="pp-grid-section">
      <div class="container">
        <div v-for="cat in categories" :key="cat.category" class="pp-category">
          <header class="pp-category__head">
            <span class="pp-category__index">
              {{ String(categories.indexOf(cat) + 1).padStart(2, "0") }}
            </span>
            <span class="pp-category__name">{{ cat.category }}</span>
            <div class="pp-category__rule" />
            <span class="pp-category__count">{{ cat.items.length }} partners</span>
          </header>

          <div class="pp-grid">
            <a
              v-for="partner in cat.items"
              :key="partner.name"
              :href="partner.url"
              target="_blank"
              rel="noopener noreferrer"
              class="pp-card"
            >
              <div class="pp-card__logo-wrap">
                <img :src="partner.logo" :alt="partner.name" class="pp-card__logo" loading="lazy" />
              </div>
              <div class="pp-card__footer">
                <span class="pp-card__name">{{ partner.name }}</span>
                <span class="pp-card__arrow">↗</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .pp {
    --orange: var(--color-brand-orange-darker);
    --dark: #08090c;
  }

  .pp-label {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--orange);
  }

  .pp-hero {
    position: relative;
    background: var(--dark);
    color: #fff;
    overflow: hidden;
    border-radius: 0 0 48px 48px;
    padding-bottom: 0;
  }

  .pp-hero__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .pp-hero__gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at -5% 70%, rgba(238, 93, 34, 0.22) 0%, transparent 55%),
      radial-gradient(ellipse 45% 40% at 100% 0%, rgba(238, 93, 34, 0.1) 0%, transparent 60%),
      radial-gradient(ellipse 30% 25% at 60% 100%, rgba(238, 93, 34, 0.06) 0%, transparent 60%);
  }

  .pp-hero__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .pp-hero__watermark {
    position: absolute;
    right: -0.05em;
    top: 50%;
    translate: 0 -50%;
    font-size: clamp(100px, 18vw, 220px);
    font-weight: 800;
    letter-spacing: -0.06em;
    color: rgba(255, 255, 255, 0.03);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    line-height: 1;
    z-index: 0;
  }

  .pp-hero__body {
    position: relative;
    z-index: 1;
    padding-top: clamp(130px, 17vw, 120px);
    padding-bottom: clamp(48px, 6vw, 72px);
    display: flex;
    flex-direction: column;
    gap: clamp(24px, 3.5vw, 40px);
  }

  .pp-hero__head {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .pp-hero__divider {
    height: 1px;
    width: 64px;
    background: var(--orange);
    opacity: 0.6;
  }

  .pp-hero__title {
    font-size: clamp(48px, 7vw, 96px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    max-width: 14ch;
  }

  .pp-hero__title em {
    font-style: italic;
    color: var(--orange);
  }

  .pp-hero__desc {
    font-size: var(--font-size-lg);
    color: rgba(255, 255, 255, 0.5);
    max-width: 50ch;
    line-height: 1.75;
  }

  .pp-hero__stats {
    display: flex;
    gap: clamp(28px, 4vw, 56px);
    padding-top: 18px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .pp-hero__stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .pp-hero__stat-num {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--orange);
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .pp-hero__stat-label {
    font-size: var(--font-size-xs);
    color: rgba(255, 255, 255, 0.35);
    letter-spacing: 0.04em;
  }

  .pp-hero__marquee-wrap {
    position: relative;
    z-index: 1;
    margin-top: clamp(40px, 6vw, 64px);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    overflow: hidden;
  }

  .pp-marquee {
    display: flex;
    width: max-content;
    padding: 18px 0;
  }

  .pp-marquee__track {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 0;
  }

  .pp-marquee__item {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.2);
    white-space: nowrap;
    padding: 0 32px;
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .pp-marquee__sep {
    color: var(--orange);
    opacity: 0.5;
  }

  .pp-grid-section {
    padding: clamp(80px, 10vw, 128px) 0 clamp(80px, 10vw, 128px);
    background: var(--color-surface-base);
  }

  .pp-category {
    margin-bottom: clamp(64px, 9vw, 112px);
  }

  .pp-category:last-child {
    margin-bottom: 0;
  }

  .pp-category__head {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .pp-category__index {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--orange);
    opacity: 0.7;
    flex-shrink: 0;
  }

  .pp-category__name {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--color-text-primary);
    letter-spacing: -0.01em;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .pp-category__rule {
    flex: 1;
    height: 1px;
    background: var(--color-border-default);
  }

  .pp-category__count {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-disabled);
    letter-spacing: 2px;
    flex-shrink: 0;
  }

  /* ── Grid — auto-fill so no ghost cells ───────────────────────── */
  .pp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1px;
    background: var(--color-border-default);
    border: 1px solid var(--color-border-default);
    border-radius: 16px;
    overflow: hidden;
  }

  .pp-card {
    background: var(--color-surface-base);
    display: flex;
    flex-direction: column;
    text-decoration: none;
    transition: background 0.22s ease;
    position: relative;
    overflow: hidden;
  }

  /* Subtle orange line on hover */
  .pp-card::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--orange);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.3s ease;
  }

  .pp-card:hover {
    background: #fafafa;
  }

  .pp-card:hover::after {
    transform: scaleX(1);
  }

  .pp-card:hover .pp-card__logo {
    filter: grayscale(0) contrast(1);
    opacity: 1;
  }

  .pp-card:hover .pp-card__arrow {
    opacity: 1;
    transform: translate(2px, -2px);
  }

  .pp-card__logo-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(28px, 3.5vw, 44px) clamp(24px, 3vw, 40px);
    min-height: 130px;
  }

  .pp-card__logo {
    max-width: 100%;
    max-height: 52px;
    width: auto;
    height: auto;
    object-fit: contain;
    filter: grayscale(1) contrast(0.7);
    opacity: 0.6;
    transition:
      filter 0.3s ease,
      opacity 0.3s ease;
  }

  .pp-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 16px;
    border-top: 1px solid var(--color-border-default);
  }

  .pp-card__name {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    font-weight: 500;
    line-height: 1.4;
  }

  .pp-card__arrow {
    font-size: 11px;
    color: var(--orange);
    opacity: 0;
    transition:
      opacity 0.2s ease,
      transform 0.25s ease;
  }

  @media (max-width: 768px) {
    .pp-hero__title {
      font-size: clamp(40px, 10vw, 64px);
    }

    .pp-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }
  }

  @media (max-width: 480px) {
    .pp-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
