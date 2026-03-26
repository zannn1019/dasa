<script setup lang="ts">
  defineProps<{ open: boolean; src: string; alt: string }>();
  defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="open"
        class="ap-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="alt"
        @click.self="$emit('close')"
      >
        <button class="ap-lightbox__close" aria-label="Close lightbox" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" stroke-linecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke-linecap="round" />
          </svg>
        </button>
        <img :src="src" :alt="alt" class="ap-lightbox__img" />
      </div>
    </Transition>
  </Teleport>
</template>

<style>
  .ap-lightbox {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(16px, 4vw, 48px);
  }

  .ap-lightbox__img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
    display: block;
  }

  .ap-lightbox__close {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    z-index: 10000;
  }

  .ap-lightbox__close:hover {
    background: rgba(255, 255, 255, 0.22);
  }

  .ap-lightbox__close svg {
    width: 20px;
    height: 20px;
    color: #fff;
  }

  .lb-enter-active,
  .lb-leave-active {
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  .lb-enter-from,
  .lb-leave-to {
    opacity: 0;
  }

  .lb-enter-from .ap-lightbox__img,
  .lb-leave-to .ap-lightbox__img {
    transform: scale(0.93);
  }
</style>
