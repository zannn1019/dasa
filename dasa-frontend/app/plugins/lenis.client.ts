/**
 * lenis.client.ts
 * Smooth scroll via Lenis, properly integrated with GSAP ScrollTrigger.
 * Uses ES module imports instead of window globals.
 */
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default defineNuxtPlugin(() => {
  const router = useRouter();
  let lenis: Lenis | null = null;
  let rafId: number | null = null;
  let removeAfterEach: (() => void) | null = null;

  const createLenis = () => {
    if (lenis) return;

    lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis scroll to ScrollTrigger — this is the critical link
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via GSAP ticker so they stay perfectly in sync
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  };

  const destroyLenis = () => {
    if (!lenis) return;

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    lenis.destroy();
    lenis = null;

    document.documentElement.classList.remove("lenis", "lenis-smooth");
    document.body.classList.remove("lenis", "lenis-smooth");
  };

  const syncLenisForRoute = () => {
    const route = router.currentRoute.value;
    const enableLenis = route.meta.lenis !== false;

    if (enableLenis) {
      createLenis();
      lenis?.start();
    } else {
      destroyLenis();
    }
  };

  if (import.meta.client) {
    syncLenisForRoute();
    removeAfterEach = router.afterEach(() => {
      syncLenisForRoute();
    });
    window.addEventListener("beforeunload", destroyLenis);
  }

  return {
    provide: {
      lenis: () => lenis,
      lenisDestroy: () => {
        removeAfterEach?.();
        removeAfterEach = null;
        if (import.meta.client) {
          window.removeEventListener("beforeunload", destroyLenis);
        }
        destroyLenis();
      },
    },
  };
});
