<script setup lang="ts">
  import gsap from "gsap";

  const emit = defineEmits<{ done: [] }>();

  const overlayRef = ref<HTMLElement | null>(null);
  const logoRef = ref<HTMLElement | null>(null);
  const dotRef = ref<HTMLElement | null>(null);
  const slicesRef = ref<HTMLElement[]>([]);
  const SLICES = 6;
  const MIN_DISPLAY_MS = 800;

  onMounted(() => {
    nextTick(() => {
      if (!overlayRef.value) return;

      document.body.style.overflow = "hidden";

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.body.style.overflow = "";
        emit("done");
        return;
      }

      const startTime = performance.now();

      // Entrance — logo fades up, dot pulses
      gsap.set(logoRef.value, { opacity: 0, y: 24 });
      gsap.set(dotRef.value, { opacity: 0, scale: 0 });
      gsap.set(slicesRef.value, { yPercent: 0 });

      const entranceTl = gsap.timeline();
      entranceTl
        .to(logoRef.value, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.1)
        .to(dotRef.value, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 0.5);

      // Infinite pulse on the dot while loading
      const pulseTween = gsap.to(dotRef.value, {
        scale: 1.8,
        opacity: 0.2,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });
      entranceTl.call(() => {
        pulseTween.play();
      });

      // Exit — called when page loaded + minimum time elapsed
      const playReveal = () => {
        pulseTween.kill();

        const exitTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = "";
            emit("done");
          },
        });

        exitTl
          .to(dotRef.value, { opacity: 0, scale: 0, duration: 0.2, ease: "power2.in" })
          // Logo scales up + blurs out — like a lens pulling focus
          .to(
            logoRef.value,
            { opacity: 0, scale: 1.15, filter: "blur(8px)", duration: 0.45, ease: "power2.in" },
            "-=0.05",
          )
          .set(overlayRef.value, { display: "none" });
      };

      const onLoaded = () => {
        const elapsed = performance.now() - startTime;
        const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
        setTimeout(playReveal, remaining);
      };

      if (document.readyState === "complete") {
        onLoaded();
      } else {
        window.addEventListener("load", onLoaded, { once: true });
      }
    });
  });
</script>

<template>
  <div ref="overlayRef" class="ls-overlay">
    <div class="ls-slices">
      <div
        v-for="i in SLICES"
        :key="i"
        :ref="(el) => el && slicesRef.push(el as HTMLElement)"
        class="ls-slice"
      />
    </div>

    <div class="ls-center">
      <NuxtImg
        ref="logoRef"
        src="/images/Logo.webp"
        alt="DASA"
        class="ls-logo"
        width="200"
        height="50"
        loading="eager"
      />
      <span ref="dotRef" class="ls-dot" />
    </div>
  </div>
</template>

<style scoped>
  .ls-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0a;
    overflow: hidden;
    pointer-events: all;
  }

  .ls-slices {
    position: absolute;
    inset: 0;
    display: flex;
  }

  .ls-slice {
    flex: 1;
    height: 100%;
    background: #0a0a0a;
    will-change: transform;
    border-right: 1px solid rgba(255, 255, 255, 0.025);
  }

  .ls-center {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    pointer-events: none;
  }

  .ls-logo {
    width: clamp(130px, 20vw, 210px);
    height: auto;
    will-change: transform, opacity, filter;
  }

  .ls-dot {
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #ee5d22;
    will-change: transform, opacity;
  }

  @media (prefers-reduced-motion: reduce) {
    .ls-overlay {
      display: none;
    }
  }
</style>
