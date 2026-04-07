<script setup lang="ts">
  interface Certification {
    name: string;
    issuer: string;
    year: string | number;
    image?: string;
  }

  const props = defineProps<{ certifications: Certification[] }>();
  defineEmits<{ openLightbox: [src: string, alt: string] }>();

  const activeCert = ref(0);

  const certDescriptions: Record<string, string> = {
    "ISO 27001:2022": "Guarantees that we operate a certified Information Security Management System — your data and systems are protected by internationally verified controls.",
    "ISO-IEC 20000-1:2018": "Certifies our IT Service Management processes meet the global standard, ensuring reliable, measurable service delivery to every client.",
    "ISO 9001:2015": "Our Quality Management System is independently audited to ensure every project follows consistent, high-quality processes from kickoff to delivery.",
    "ISO 14001:2015": "Demonstrates our commitment to minimising environmental impact through responsible operations and sustainable infrastructure practices.",
    "ISO 37001:2016": "An independently certified Anti-Bribery Management System — a strong signal of ethical governance and transparency in every business relationship.",
    "ISO 45001:2018": "Certified Occupational Health and Safety management, showing we invest in the well-being of the people who build and maintain your systems.",
    "ISO/IEC 15504-5:2012": "Validates our software process capability through rigorous assessment, giving clients confidence in predictable, repeatable engineering outcomes.",
    "ISO/IEC 25010:2011": "We follow the international standard for software quality characteristics — ensuring our deliverables meet defined criteria for reliability, security, and maintainability.",
  };

  const activeCertData = computed(() => props.certifications[activeCert.value]);

  function getCertDesc(name: string): string {
    return certDescriptions[name] ?? "";
  }
</script>

<template>
  <section class="ap-certs">
    <div class="container">
      <div class="ap-section__header">
        <span class="ap-label">Certifications</span>
        <h2 class="ap-section__title">
          Our credentials
        </h2>
      </div>

      <div class="ap-certs__split">
        <nav class="ap-certs__tabs" aria-label="Certifications list">
          <button
            v-for="(cert, i) in certifications"
            :key="cert.name"
            class="ap-certs__tab"
            :class="{ 'ap-certs__tab--active': activeCert === i }"
            :aria-pressed="activeCert === i"
            @click="activeCert = i"
          >
            <div class="ap-certs__tab-head">
              <div class="ap-certs__tab-index">{{ String(i + 1).padStart(2, "0") }}</div>
              <div class="ap-certs__tab-meta">
                <span class="ap-certs__tab-name">{{ cert.name }}</span>
                <span class="ap-certs__tab-issuer">{{ cert.issuer }}</span>
              </div>
              <span class="ap-certs__tab-year">{{ cert.year }}</span>
            </div>
            <Transition name="cert-desc">
              <p v-if="activeCert === i" class="ap-certs__tab-desc">
                {{ getCertDesc(cert.name) || cert.issuer }}
              </p>
            </Transition>
          </button>
        </nav>

        <div class="ap-certs__showcase">
          <Transition name="cert-fade" mode="out-in">
            <div :key="activeCert" class="ap-certs__showcase-inner">
              <div class="ap-certs__showcase-frame">
                <img
                  v-if="activeCertData?.image"
                  :src="activeCertData.image"
                  :alt="activeCertData.name"
                  class="ap-certs__showcase-img"
                  loading="lazy"
                />
                <div v-else class="ap-certs__showcase-placeholder" aria-hidden="true">
                  <svg viewBox="0 0 64 80" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="8" y="4" width="48" height="72" rx="4" />
                    <path d="M20 24h24M20 34h24M20 44h16" stroke-linecap="round" />
                  </svg>
                </div>
                <button
                  v-if="activeCertData?.image"
                  class="ap-certs__showcase-expand"
                  :aria-label="`View full certificate: ${activeCertData.name}`"
                  @click="$emit('openLightbox', activeCertData.image!, activeCertData.name)"
                >
                  <IconExpand />
                  <span>Full view</span>
                </button>
              </div>
              <div class="ap-certs__showcase-caption">
                <span class="ap-certs__showcase-name">{{ activeCertData?.name }}</span>
                <span class="ap-certs__showcase-sub">{{ activeCertData?.issuer }}</span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .ap-certs {
    padding: clamp(72px, 10vw, 128px) 0;
    border-top: 1px solid var(--color-border-default);
    background: #f7f5f2;
  }

  .ap-certs__split {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: clamp(32px, 4vw, 64px);
    align-items: start;
  }

  .ap-certs__tabs {
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--color-border-default);
    background: #fff;
  }

  .ap-certs__tab {
    text-align: left;
    padding: clamp(14px, 2vw, 20px) clamp(16px, 2.5vw, 24px);
    border: none;
    border-bottom: 1px solid var(--color-border-default);
    background: transparent;
    cursor: pointer;
    transition: background 0.2s;
    position: relative;
    overflow: hidden;
  }

  .ap-certs__tab:last-child {
    border-bottom: none;
  }

  .ap-certs__tab::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--ap-orange);
    transform: scaleY(0);
    transition: transform 0.25s ease;
    transform-origin: center;
  }

  .ap-certs__tab--active::before {
    transform: scaleY(1);
  }
  .ap-certs__tab--active {
    background: rgba(238, 93, 34, 0.04);
  }
  .ap-certs__tab:hover:not(.ap-certs__tab--active) {
    background: #f9fafb;
  }

  .ap-certs__tab-head {
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.5vw, 16px);
  }

  .ap-certs__tab-index {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--ap-orange);
    letter-spacing: 2px;
    flex-shrink: 0;
    width: 24px;
  }

  .ap-certs__tab-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  .ap-certs__tab-name {
    font-size: clamp(13px, 0.75rem + 0.25vw, 15px);
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  .ap-certs__tab--active .ap-certs__tab-name {
    color: var(--ap-orange);
  }

  .ap-certs__tab-issuer {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  .ap-certs__tab-year {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    color: var(--color-text-disabled);
    letter-spacing: 1px;
    flex-shrink: 0;
  }

  .ap-certs__tab-desc {
    margin-top: 10px;
    padding-left: calc(24px + clamp(10px, 1.5vw, 16px));
    font-size: var(--font-size-sm);
    line-height: 1.7;
    color: var(--color-text-secondary);
  }

  .cert-desc-enter-active,
  .cert-desc-leave-active {
    transition:
      opacity 0.22s ease,
      transform 0.22s ease;
  }
  .cert-desc-enter-from,
  .cert-desc-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }

  .ap-certs__showcase {
    position: sticky;
    top: calc(var(--header-height, 72px) + 80px);
  }

  .ap-certs__showcase-inner {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ap-certs__showcase-frame {
    background: #fff;
    border-radius: 24px;
    padding: clamp(24px, 3vw, 40px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 12px 40px rgba(0, 0, 0, 0.07);
    min-height: 400px;
  }

  .ap-certs__showcase-img {
    max-width: 100%;
    max-height: 480px;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
    border-radius: 8px;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.08),
      0 16px 48px rgba(0, 0, 0, 0.12);
  }

  .ap-certs__showcase-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
  }

  .ap-certs__showcase-placeholder svg {
    width: 64px;
    height: 80px;
  }

  .ap-certs__showcase-expand {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: rgba(8, 9, 12, 0.75);
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    backdrop-filter: blur(6px);
    transition: background 0.2s;
  }

  .ap-certs__showcase-expand:hover {
    background: rgba(8, 9, 12, 0.92);
  }
  .ap-certs__showcase-expand :deep(svg) {
    width: 13px;
    height: 13px;
  }

  .ap-certs__showcase-caption {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 4px;
  }

  .ap-certs__showcase-name {
    font-size: var(--font-size-lg);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
  }

  .ap-certs__showcase-sub {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
  }

  .cert-fade-enter-active,
  .cert-fade-leave-active {
    transition:
      opacity 0.28s ease,
      transform 0.28s ease;
  }
  .cert-fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .cert-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  @media (max-width: 1024px) {
    .ap-certs__split {
      grid-template-columns: 1fr;
    }
    .ap-certs__showcase {
      position: static;
      order: -1;
    }
    .ap-certs__showcase-frame {
      min-height: 300px;
    }
  }
</style>
