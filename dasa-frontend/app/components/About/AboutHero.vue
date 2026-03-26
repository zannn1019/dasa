<script setup lang="ts">
  defineProps<{ description: string }>();

  const { t } = useLanguage();
</script>

<template>
  <section class="ap-hero">
    <div class="ap-hero__bg" aria-hidden="true">
      <div class="ap-hero__gradient" />
      <div class="ap-hero__grid" />
    </div>

    <div class="ap-hero__watermark" aria-hidden="true">About</div>

    <div class="container ap-hero__body">
      <div class="ap-hero__head">
        <span class="ap-hero__tag ap-label">
          {{ t({ en: "Who We Are", id: "Siapa Kami" }) }}
        </span>
        <div class="ap-hero__divider" />
      </div>

      <h1 class="ap-hero__title">
        {{ t({ en: "Building tomorrow's", id: "Membangun" }) }}
        <br />
        <em>{{ t({ en: "digital infrastructure", id: "infrastruktur digital" }) }}</em>
        <br />
        {{ t({ en: "today", id: "masa depan" }) }}
      </h1>

      <p class="ap-hero__desc">{{ description }}</p>
    </div>
  </section>
</template>

<style scoped>
  .ap-hero {
    position: relative;
    background: var(--ap-dark);
    color: #fff;
    overflow: hidden;
    border-radius: 0 0 48px 48px;
  }

  .ap-hero__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .ap-hero__gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 65% 55% at -5% 65%, rgba(238, 93, 34, 0.22) 0%, transparent 55%),
      radial-gradient(ellipse 40% 35% at 100% 0%, rgba(238, 93, 34, 0.1) 0%, transparent 60%);
  }

  .ap-hero__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .ap-hero__watermark {
    position: absolute;
    right: -0.05em;
    top: 50%;
    translate: 0 -50%;
    font-size: clamp(100px, 18vw, 240px);
    font-weight: 800;
    letter-spacing: -0.06em;
    color: rgba(255, 255, 255, 0.03);
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    line-height: 1;
    z-index: 0;
  }

  .ap-hero__body {
    position: relative;
    z-index: 1;
    padding-top: clamp(130px, 16vw, 200px);
    padding-bottom: clamp(56px, 7vw, 88px);
    display: flex;
    flex-direction: column;
    gap: clamp(20px, 3vw, 36px);
  }

  .ap-hero__head {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .ap-hero__divider {
    height: 1px;
    width: 64px;
    background: var(--ap-orange);
    opacity: 0.6;
  }

  .ap-hero__title {
    font-size: clamp(40px, 6.5vw, 88px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.04em;
    max-width: 16ch;
  }

  .ap-hero__title em {
    font-style: italic;
    color: var(--ap-orange);
  }

  .ap-hero__desc {
    font-size: var(--font-size-lg);
    color: rgba(255, 255, 255, 0.5);
    max-width: 52ch;
    line-height: 1.75;
  }

  @media (max-width: 768px) {
    .ap-hero {
      border-radius: 0 0 28px 28px;
    }
  }
</style>
