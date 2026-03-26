<script setup lang="ts">
  interface Props {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
    size?: "sm" | "md" | "lg";
    as?: "button" | "a" | "NuxtLink";
    to?: string;
    href?: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: boolean;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
    radius?: "sm" | "md" | "lg" | "full";
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "primary",
    size: "md",
    as: "button",
    disabled: false,
    loading: false,
    icon: false,
    iconPosition: "right",
    fullWidth: false,
    radius: "full",
  });

  const emit = defineEmits(["click"]);

  const handleClick = (event: MouseEvent) => {
    if (!props.disabled && !props.loading) {
      emit("click", event);
    }
  };

  const componentTag = computed(() => {
    if (props.to) return resolveComponent("NuxtLink");
    if (props.href) return "a";
    return "button";
  });

  const componentProps = computed(() => {
    const baseProps: any = {};

    if (props.to) {
      baseProps.to = props.to;
    } else if (props.href) {
      baseProps.href = props.href;
      baseProps.target = "_blank";
      baseProps.rel = "noopener noreferrer";
    } else {
      baseProps.type = "button";
    }

    if (props.disabled || props.loading) {
      baseProps.disabled = true;
      baseProps["aria-disabled"] = "true";
    }

    return baseProps;
  });
</script>

<template>
  <component
    :is="componentTag"
    v-bind="componentProps"
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      `base-button--radius-${radius}`,
      {
        'base-button--disabled': disabled,
        'base-button--loading': loading,
        'base-button--icon-only': icon,
        'base-button--full-width': fullWidth,
      },
    ]"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner">
      <svg class="spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          class="spinner-circle"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="3"
        />
      </svg>
    </span>

    <span
      v-if="$slots.icon && iconPosition === 'left' && !loading"
      class="base-button__icon base-button__icon--left"
    >
      <slot name="icon" />
    </span>

    <span v-if="!icon" class="base-button__content">
      <slot />
    </span>

    <span v-else class="base-button__icon-content">
      <slot />
    </span>

    <span
      v-if="$slots.icon && iconPosition === 'right' && !loading"
      class="base-button__icon base-button__icon--right"
    >
      <slot name="icon" />
    </span>
  </component>
</template>

<style scoped>
  .base-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    border: none;
    font-family: var(--font-main);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    user-select: none;
  }

  .base-button:focus-visible {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 2px;
  }

  .base-button--radius-sm {
    border-radius: var(--radius-sm);
  }

  .base-button--radius-md {
    border-radius: var(--radius-md);
  }

  .base-button--radius-lg {
    border-radius: var(--radius-lg);
  }

  .base-button--radius-full {
    border-radius: var(--radius-full);
  }

  /* Sizes - Mobile First with Fluid Scaling */
  .base-button--sm {
    padding: clamp(0.375rem, 0.5vw, 0.5rem) clamp(1rem, 2vw, 1.5rem);
    font-size: clamp(0.75rem, 1.2vw, 0.875rem);
    min-height: clamp(32px, 5vw, 36px);
    gap: clamp(0.25rem, 0.5vw, 0.5rem);
  }

  .base-button--md {
    padding: clamp(0.5rem, 0.8vw, 0.75rem) clamp(1.5rem, 3vw, 2.5rem);
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    min-height: clamp(40px, 6vw, 44px);
    gap: clamp(0.375rem, 0.6vw, 0.5rem);
  }

  .base-button--lg {
    padding: clamp(0.75rem, 1.2vw, 1rem) clamp(2rem, 4vw, 3rem);
    font-size: clamp(1rem, 1.8vw, 1.125rem);
    min-height: clamp(48px, 7vw, 56px);
    gap: clamp(0.5rem, 0.8vw, 0.75rem);
  }

  /* Icon-only buttons - Fluid Scaling */
  .base-button--icon-only.base-button--sm {
    padding: clamp(0.375rem, 0.5vw, 0.5rem);
    width: clamp(32px, 5vw, 36px);
    min-height: clamp(32px, 5vw, 36px);
  }

  .base-button--icon-only.base-button--md {
    padding: clamp(0.5rem, 0.8vw, 0.75rem);
    width: clamp(40px, 6vw, 44px);
    min-height: clamp(40px, 6vw, 44px);
  }

  .base-button--icon-only.base-button--lg {
    padding: clamp(0.75rem, 1.2vw, 1rem);
    width: clamp(48px, 7vw, 56px);
    min-height: clamp(48px, 7vw, 56px);
  }

  .base-button--primary {
    background-color: var(--dt-orange);
    color: var(--dt-white);
    box-shadow:
      0px 1px 1px rgba(238, 93, 34, 0.01),
      0px 5px 4px rgba(238, 93, 34, 0.02),
      0px 12px 9px rgba(238, 93, 34, 0.04),
      0px 20px 15px rgba(238, 93, 34, 0.05),
      0px 32px 24px rgba(238, 93, 34, 0.06);
  }

  .base-button--primary:hover:not(:disabled) {
    background-color: #d14d1f;
    transform: translateY(-2px);
    box-shadow:
      0px 2px 2px rgba(238, 93, 34, 0.02),
      0px 10px 8px rgba(238, 93, 34, 0.04),
      0px 24px 18px rgba(238, 93, 34, 0.06),
      0px 40px 30px rgba(238, 93, 34, 0.08),
      0px 64px 48px rgba(238, 93, 34, 0.1);
  }

  .base-button--primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .base-button--secondary {
    background-color: #d14e1f56;
    color: var(--dt-white);
    box-shadow:
      0px 1px 1px rgba(191, 64, 64, 0.01),
      0px 5px 4px rgba(191, 64, 64, 0.02),
      0px 12px 9px rgba(191, 64, 64, 0.04),
      0px 20px 15px rgba(191, 64, 64, 0.05),
      0px 32px 24px rgba(191, 64, 64, 0.06);
  }

  .base-button--secondary:hover:not(:disabled) {
    background-color: #d14e1f80;
    transform: translateY(-1px);
  }

  .base-button--secondary:active:not(:disabled) {
    transform: translateY(0);
  }

  .base-button--outline {
    background-color: transparent;
    color: var(--dt-orange);
    border: 2px solid var(--dt-orange);
  }

  .base-button--outline:hover:not(:disabled) {
    background-color: rgba(238, 93, 34, 0.1);
    border-color: #d14d1f;
    color: #d14d1f;
  }

  .base-button--outline:active:not(:disabled) {
    background-color: rgba(238, 93, 34, 0.2);
  }

  .base-button--ghost {
    background-color: transparent;
    color: var(--dt-white);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .base-button--ghost:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .base-button--ghost:active:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .base-button--link {
    background-color: transparent;
    color: var(--dt-orange);
    padding: var(--spacing-2) var(--spacing-4);
  }

  .base-button--link:hover:not(:disabled) {
    background-color: rgba(238, 93, 34, 0.1);
    color: #d14d1f;
  }

  .base-button--link:active:not(:disabled) {
    background-color: rgba(238, 93, 34, 0.2);
  }

  .base-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .base-button--loading {
    cursor: wait;
    pointer-events: none;
  }

  .base-button--loading .base-button__content,
  .base-button--loading .base-button__icon-content {
    opacity: 0;
  }

  .base-button--full-width {
    width: 100%;
  }

  /* Icon Styles - Responsive Sizing */
  .base-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: clamp(16px, 2.5vw, 20px);
    height: clamp(16px, 2.5vw, 20px);
  }

  .base-button__icon :deep(svg) {
    width: 100%;
    height: 100%;
  }

  .base-button__spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    width: clamp(16px, 2.5vw, 20px);
    height: clamp(16px, 2.5vw, 20px);
    animation: spin 0.8s linear infinite;
  }

  .spinner-circle {
    opacity: 0.25;
    stroke-dasharray: 60;
    stroke-dashoffset: 20;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: 60;
    }
    50% {
      stroke-dashoffset: 15;
    }
    100% {
      stroke-dashoffset: 60;
    }
  }

  .base-button--outline {
    color: var(--dt-white);
    border-color: var(--dt-white);
  }

  .base-button--outline:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: var(--dt-white);
    color: var(--dt-white);
  }

  /* Mobile - Optimize touch targets */
  @media (max-width: 480px) {
    .base-button {
      font-weight: 600;
    }

    .base-button--sm {
      min-height: 36px;
    }

    .base-button--md {
      min-height: 44px;
    }

    .base-button--lg {
      min-height: 48px;
    }

    /* Make full-width on very small screens */
    .base-button--lg:not(.base-button--icon-only) {
      width: 100%;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .base-button--sm {
      min-height: 34px;
    }

    .base-button--md {
      min-height: 42px;
    }

    .base-button--lg {
      min-height: 50px;
    }
  }

  @media (min-width: 1024px) {
    .base-button:hover:not(:disabled) {
      transform: translateY(-1px);
    }

    .base-button--primary:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  }

  /* Large Desktop - Maximum constraints */
  @media (min-width: 1920px) {
    .base-button--sm {
      max-width: 200px;
    }

    .base-button--md {
      max-width: 300px;
    }

    .base-button--lg:not(.base-button--full-width) {
      max-width: 400px;
    }
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .base-button,
    .base-button--primary:hover:not(:disabled),
    .base-button--secondary:hover:not(:disabled) {
      transform: none;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .spinner {
      animation: none;
    }
  }
</style>
