<script setup lang="ts">
defineProps<{ description: string, aboutPageDescription: string }>();
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
          Who We Are
        </span>
        <div class="ap-hero__divider" />
      </div>

      <div class="ap-hero__grid-content">
        <div class="ap-hero__left">
          <h1 class="ap-hero__title">
            <!-- <em>DASA</em> -->
            <img src="@/assets/images/Logo.png" alt="DASA Logo">
          </h1>
        </div>

        <div class="ap-hero__right">
          <div class="ap-hero__accent-bar" />
          <div class="ap-hero__text-content">
            <p class="ap-hero__subtitle">
              Indonesia’s digital infrastructure and intelligent systems company, architecting sovereign, secure, and scalable technology platforms for public institutions and enterprises in Indonesia.
            </p>
            <p class="ap-hero__desc">{{ aboutPageDescription }}</p>
          </div>
        </div>
      </div>
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
  padding-bottom: clamp(80px, 10vw, 120px);
  display: flex;
  flex-direction: column;
  gap: clamp(60px, 8vw, 100px);
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

.ap-hero__grid-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: clamp(60px, 8vw, 100px);
  align-items: start;
}

.ap-hero__left {
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 3vw, 40px);
  padding-top: clamp(20px, 2vw, 40px);
}

.ap-hero__title {
  font-size: clamp(48px, 12vw, 96px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  margin: 0;
}

.ap-hero__title img {
  width: 100%;
  max-width: 500;
}

.ap-hero__title em {
  font-style: italic;
  color: var(--ap-orange);
  font-weight: 700;
  display: block;
}

.ap-hero__tagline {
  font-size: clamp(16px, 2vw, 18px);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0;
  letter-spacing: -0.01em;
  max-width: 60ch;
}

.ap-hero__right {
  position: relative;
  display: flex;
  gap: clamp(28px, 4vw, 40px);
  align-items: flex-start;
}

.ap-hero__accent-bar {
  width: 4px;
  min-height: 300px;
  background: linear-gradient(180deg, var(--ap-orange), rgba(238, 93, 34, 0.3));
  border-radius: 4px;
  flex-shrink: 0;
}

.ap-hero__text-content {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 3vw, 32px);
  padding-top: clamp(12px, 2vw, 20px);
}

.ap-hero__subtitle {
  font-size: clamp(18px, 2.5vw, 22px);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.5;
  margin: 0;
  letter-spacing: -0.01em;
  max-width: 55ch;
}

.ap-hero__desc {
  font-size: clamp(14px, 1.8vw, 16px);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.75;
  margin: 0;
  max-width: 60ch;
}

@media (max-width: 1024px) {
  .ap-hero__grid-content {
    grid-template-columns: 1fr;
    gap: clamp(40px, 6vw, 60px);
  }

  .ap-hero__left {
    gap: clamp(16px, 2vw, 28px);
  }

  .ap-hero__right {
    gap: clamp(20px, 3vw, 32px);
  }

  .ap-hero__accent-bar {
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .ap-hero {
    border-radius: 0 0 28px 28px;
  }

  .ap-hero__grid-content {
    grid-template-columns: 1fr;
  }

  .ap-hero__right {
    flex-direction: column;
    gap: clamp(16px, 2vw, 24px);
  }

  .ap-hero__accent-bar {
    width: 100%;
    height: 3px;
    min-height: auto;
    margin-bottom: 12px;
  }
}
</style>
