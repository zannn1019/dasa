import Lenis from "lenis";

export default defineNuxtPlugin(() => {
  let lenis: Lenis | null = null;

  if (process.client) {
    // Initialize Lenis
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // RAF loop
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger
    if (typeof window !== "undefined" && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);

      window.gsap?.ticker.add((time: number) => {
        lenis?.raf(time * 1000);
      });

      window.gsap?.ticker.lagSmoothing(0);
    }
  }

  return {
    provide: {
      lenis,
    },
  };
});
