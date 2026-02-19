<script setup lang="ts">
  interface Props {
    currentIndex: number;
    totalItems: number;
    labels?: string[];
    showLabels?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    showLabels: true,
  });

  const emit = defineEmits<{
    prev: [];
    next: [];
    change: [index: number];
  }>();

  const currentLabel = computed(() => {
    if (props.labels && props.labels[props.currentIndex]) {
      return props.labels[props.currentIndex];
    }
    return `${props.currentIndex + 1} / ${props.totalItems}`;
  });

  const progressPercentage = computed(() => {
    if (props.totalItems <= 1) return 0;
    return (props.currentIndex / (props.totalItems - 1)) * 100;
  });

  const canGoPrev = computed(() => props.currentIndex > 0);
  const canGoNext = computed(() => props.currentIndex < props.totalItems - 1);

  const handlePrev = () => {
    if (canGoPrev.value) {
      emit("prev");
      emit("change", props.currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext.value) {
      emit("next");
      emit("change", props.currentIndex + 1);
    }
  };
</script>

<template>
  <div class="pagination">
    <button
      class="pagination__button pagination__button--prev"
      :disabled="!canGoPrev"
      @click="handlePrev"
      aria-label="Previous"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="pagination__content">
      <div class="pagination__line">
        <div class="pagination__line-progress" :style="{ width: `${progressPercentage}%` }"></div>
      </div>
      <span v-if="showLabels" class="pagination__label">{{ currentLabel }}</span>
    </div>

    <button
      class="pagination__button pagination__button--next"
      :disabled="!canGoNext"
      @click="handleNext"
      aria-label="Next"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
  .pagination {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    width: fit-content;
  }

  .pagination__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: transparent;
    color: var(--dt-white);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .pagination__button::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--dt-orange);
    transform: scale(0);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
  }

  .pagination__button:hover:not(:disabled) {
    border-color: var(--dt-orange);
    transform: scale(1.1);
  }

  .pagination__button:hover:not(:disabled)::before {
    transform: scale(1);
  }

  .pagination__button:active:not(:disabled) {
    transform: scale(1);
  }

  .pagination__button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: rgba(255, 255, 255, 0.15);
  }

  .pagination__button svg {
    width: 24px;
    height: 24px;
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  .pagination__button--prev:hover:not(:disabled) svg {
    transform: translateX(-2px);
  }

  .pagination__button--next:hover:not(:disabled) svg {
    transform: translateX(2px);
  }

  .pagination__content {
    display: flex;
    align-items: center;
    gap: var(--spacing-4);
    padding: 0 var(--spacing-4);
    position: relative;
  }

  .pagination__line {
    width: 300px;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
    position: relative;
    overflow: hidden;
  }

  .pagination__line-progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: linear-gradient(to right, var(--dt-orange), rgba(255, 255, 255, 0.6));
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 8px rgba(238, 93, 34, 0.5);
  }

  .pagination__label {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 50%);
    font-size: var(--font-size-base);
    font-weight: 500;
    color: var(--dt-white);
    white-space: nowrap;
    padding: var(--spacing-2) var(--spacing-6);
    border-radius: var(--radius-full);
    text-align: center;
    letter-spacing: 0.5px;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .pagination {
      gap: var(--spacing-3);
    }

    .pagination__button {
      width: 40px;
      height: 40px;
    }

    .pagination__button svg {
      width: 20px;
      height: 20px;
    }

    .pagination__line {
      width: 200px;
    }

    .pagination__label {
      font-size: var(--font-size-sm);
      padding: var(--spacing-1) var(--spacing-4);
    }
  }

  @media (max-width: 480px) {
    .pagination {
      gap: var(--spacing-2);
    }

    .pagination__button {
      width: 36px;
      height: 36px;
    }

    .pagination__line {
      width: 150px;
    }

    .pagination__label {
      font-size: var(--font-size-xs);
    }
  }
</style>
