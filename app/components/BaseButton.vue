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

  /* Radius */
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

  /* Sizes */
  .base-button--sm {
    padding: var(--spacing-2) var(--spacing-6);
    font-size: var(--font-size-xs);
    min-height: 32px;
  }

  .base-button--md {
    padding: var(--spacing-3) var(--spacing-10);
    font-size: var(--font-size-sm);
    min-height: 40px;
  }

  .base-button--lg {
    padding: var(--spacing-4) var(--spacing-12);
    font-size: var(--font-size-base);
    min-height: 48px;
  }

  /* Icon-only buttons */
  .base-button--icon-only.base-button--sm {
    padding: var(--spacing-2);
    width: 32px;
    min-height: 32px;
  }

  .base-button--icon-only.base-button--md {
    padding: var(--spacing-3);
    width: 40px;
    min-height: 40px;
  }

  .base-button--icon-only.base-button--lg {
    padding: var(--spacing-4);
    width: 48px;
    min-height: 48px;
  }

  /* Primary Variant */
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

  /* Secondary Variant */
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

  /* Outline Variant */
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

  /* Ghost Variant */
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

  /* Link Variant */
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

  /* Disabled State */
  .base-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Loading State */
  .base-button--loading {
    cursor: wait;
    pointer-events: none;
  }

  .base-button--loading .base-button__content,
  .base-button--loading .base-button__icon-content {
    opacity: 0;
  }

  /* Full Width */
  .base-button--full-width {
    width: 100%;
  }

  /* Icon Styles */
  .base-button__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .base-button__icon :deep(svg) {
    width: 100%;
    height: 100%;
  }

  /* Spinner */
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
    width: 20px;
    height: 20px;
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

  /* Dark background adjustments */
  .base-button--outline {
    color: var(--dt-white);
    border-color: var(--dt-white);
  }

  .base-button--outline:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: var(--dt-white);
    color: var(--dt-white);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .base-button--lg {
      padding: var(--spacing-3) var(--spacing-10);
      font-size: var(--font-size-sm);
      min-height: 44px;
    }
  }
</style>
