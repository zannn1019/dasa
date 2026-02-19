<script setup lang="ts">
  import gsap from "gsap";
  import logo from "~/assets/images/Logo.png";

  const emit = defineEmits<{
    done: [];
  }>();

  const overlayRef = ref<HTMLElement | null>(null);
  const logoRef = ref<HTMLElement | null>(null);
  const glowRef = ref<HTMLElement | null>(null);
  const counterRef = ref<HTMLElement | null>(null);

  onMounted(() => {
    nextTick(() => {
      if (!overlayRef.value || !logoRef.value || !glowRef.value || !counterRef.value) return;

      // Lock scroll during loading
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          emit("done");
        },
      });

      // Phase 1: Logo entrance — fade in + scale up from small
      tl.set(logoRef.value, { opacity: 0, scale: 0.6, y: 20 })
        .set(glowRef.value, { opacity: 0, scale: 0.5 })
        .set(counterRef.value, { opacity: 0 })
        .to(logoRef.value, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        })

        // Phase 2: Glow pulse appears behind logo
        .to(
          glowRef.value,
          {
            opacity: 0.6,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.4",
        )

        .to(
          [counterRef.value],
          {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
          },
          "-=0.2",
        )

        // Phase 5: Glow pulses once more
        .to(
          glowRef.value,
          {
            scale: 1.3,
            opacity: 0.8,
            duration: 0.1,
            ease: "power2.in",
            yoyo: true,
            repeat: 1,
          },
          "-=0.4",
        )

        // Phase 6: Everything scales up and fades, overlay slides away
        .to([logoRef.value, glowRef.value, counterRef.value], {
          opacity: 0,
          scale: 1.1,
          duration: 0.5,
          ease: "power3.in",
        })
        .to(overlayRef.value, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        });
    });
  });
</script>

<template>
  <div class="loading-overlay" ref="overlayRef">
    <div class="loading-content">
      <!-- Glow effect behind logo -->
      <div class="logo-glow" ref="glowRef"></div>

      <!-- Logo -->
      <img :src="logo" alt="DASA" class="loading-logo" ref="logoRef" />

      <!-- Counter -->
      <span class="loading-counter" ref="counterRef"></span>
    </div>
  </div>
</template>

<style scoped>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    will-change: transform;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    position: relative;
  }

  .logo-glow {
    position: absolute;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(238, 93, 34, 0.25) 0%,
      rgba(238, 93, 34, 0.08) 40%,
      transparent 70%
    );
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    will-change: transform, opacity;
  }

  .loading-logo {
    width: 220px;
    height: auto;
    position: relative;
    z-index: 1;
    will-change: transform, opacity;
  }

  .loading-counter {
    font-family: var(--font-mono, "JetBrains Mono", monospace);
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 2px;
  }
</style>
