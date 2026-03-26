<script setup lang="ts">
  import gsap from "gsap";

  const panelRef = ref<HTMLElement | null>(null);

  const leave = (): Promise<void> =>
    new Promise((resolve) => {
      if (!panelRef.value) return resolve();
      const tl = gsap.timeline({ onComplete: resolve });
      tl.set(panelRef.value, { display: "block", pointerEvents: "all", xPercent: -100 }).to(
        panelRef.value,
        { xPercent: 0, duration: 0.45, ease: "power3.inOut" },
      );
    });

  const enter = (pageEl?: HTMLElement): Promise<void> =>
    new Promise((resolve) => {
      if (!panelRef.value) {
        if (pageEl) pageEl.style.opacity = "";
        return resolve();
      }
      const tl = gsap.timeline({ onComplete: resolve });
      tl.call(() => {
        if (pageEl) pageEl.style.opacity = "";
      })
        .to(panelRef.value, { xPercent: 100, duration: 0.45, ease: "power3.inOut" })
        .set(panelRef.value, { display: "none", pointerEvents: "none" });
    });

  defineExpose({ leave, enter });
</script>

<template>
  <div ref="panelRef" class="pt-panel" />
</template>

<style scoped>
  .pt-panel {
    position: fixed;
    inset: 0;
    z-index: 99990;
    display: none;
    pointer-events: none;
    background: #0b0b0b;
    will-change: transform;
  }
</style>
