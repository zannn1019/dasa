<script setup lang="ts">
  defineProps<{
    vision: string;
    mission: string[];
  }>();
</script>

<template>
  <section class="ap-vision-mission">
    <div class="container">
      <div class="ap-section__header">
        <span class="ap-label">Vision & Mission</span>
        <h2 class="ap-section__title">
          Where we're headed
        </h2>
      </div>

      <div class="ap-vm__grid">
        <div class="ap-vision__card">
          <div class="ap-icon-wrap">
            <svg
              class="ap-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              aria-hidden="true"
            >
              <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle cx="12" cy="12" r="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h3 class="ap-card__heading">Our Vision</h3>
          <p class="ap-vision__text">{{ vision }}</p>
        </div>

        <div class="ap-mission">
          <div class="ap-mission__heading-wrap">
            <div class="ap-icon-wrap">
              <svg
                class="ap-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
              >
                <path
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path d="M12 8v4l3 3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="ap-card__heading">Our Mission</h3>
          </div>
          <ul class="ap-mission__list">
            <li v-for="(item, i) in mission" :key="i" class="ap-mission__item">
              <span class="ap-mission__check" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline
                    points="2.5,8 6.5,12 13.5,4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .ap-vision-mission {
    padding: clamp(72px, 10vw, 128px) 0;
    background: #fafafa;
  }

  .ap-vm__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(20px, 3vw, 40px);
    align-items: start;
  }

  .ap-vision__card {
    background: var(--ap-dark);
    color: #fff;
    border-radius: 24px;
    padding: clamp(32px, 4vw, 56px);
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
  }

  .ap-icon-wrap {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: rgba(238, 93, 34, 0.12);
  }

  .ap-icon {
    width: 24px;
    height: 24px;
    color: var(--ap-orange);
  }

  .ap-card__heading {
    font-size: clamp(1.1rem, 0.9rem + 0.7vw, 1.5rem);
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .ap-vision__text {
    font-size: clamp(0.95rem, 0.82rem + 0.4vw, 1.15rem);
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.65);
    flex: 1;
  }

  .ap-mission {
    background: #fff;
    border: 1px solid var(--color-border-default);
    border-radius: 24px;
    padding: clamp(32px, 4vw, 56px);
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
  }

  .ap-mission__heading-wrap {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .ap-mission__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ap-mission__item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: clamp(0.9rem, 0.82rem + 0.35vw, 1.05rem);
    line-height: 1.65;
    color: var(--color-text-secondary);
  }

  .ap-mission__check {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(238, 93, 34, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
  }

  .ap-mission__check svg {
    width: 10px;
    height: 10px;
    color: var(--ap-orange);
  }

  @media (max-width: 1024px) {
    .ap-vm__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
