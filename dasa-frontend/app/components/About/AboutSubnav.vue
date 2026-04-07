<script setup lang="ts">
  import type { SubnavSection } from "~/composables/useAboutSubnav";

  defineProps<{
    sections: SubnavSection[];
    activeSection: string;
    visible: boolean;
  }>();

  defineEmits<{ scrollTo: [id: string] }>();
</script>

<template>
  <nav class="ap-subnav" :class="{ 'ap-subnav--visible': visible }" aria-label="Page sections">
    <div class="container ap-subnav__inner">
      <button
        v-for="s in sections"
        :key="s.id"
        class="ap-subnav__pill"
        :class="{ 'ap-subnav__pill--active': activeSection === s.id }"
        :aria-current="activeSection === s.id ? 'true' : undefined"
        @click="$emit('scrollTo', s.id)"
      >
        {{ s.label.en }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
  .ap-subnav {
    position: sticky;
    top: var(--header-height, 72px);
    z-index: 50;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--color-border-default);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition:
      transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.35s ease;
  }

  .ap-subnav--visible {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .ap-subnav__inner {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-top: 10px;
    padding-bottom: 10px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .ap-subnav__inner::-webkit-scrollbar {
    display: none;
  }

  .ap-subnav__pill {
    flex-shrink: 0;
    padding: 6px 18px;
    border-radius: 999px;
    border: 1.5px solid transparent;
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text-secondary);
    background: transparent;
    cursor: pointer;
    transition:
      background 0.2s,
      color 0.2s,
      border-color 0.2s;
    white-space: nowrap;
  }

  .ap-subnav__pill:hover {
    background: rgba(238, 93, 34, 0.06);
    color: var(--ap-orange);
  }

  .ap-subnav__pill--active {
    background: var(--ap-dark);
    color: #fff;
    border-color: var(--ap-dark);
  }

  @media (max-width: 768px) {
    .ap-subnav__pill {
      font-size: var(--font-size-xs);
      padding: 5px 14px;
    }
  }
</style>
