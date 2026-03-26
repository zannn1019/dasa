import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

interface HeroRefs {
  heroRef: Ref<HTMLElement | null>;
  titleRef: Ref<HTMLElement | null>;
  subtitleRef: Ref<HTMLElement | null>;
  buttonRef: Ref<HTMLElement | null>;
  sliderRef: Ref<HTMLElement | null>;
}

export const useHeroAnimations = () => {
  const ctx = ref<gsap.Context | null>(null);

  const initAnimations = (refs: HeroRefs) => {
    if (!import.meta.client || !refs.heroRef.value) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ctx.value = gsap.context(() => {
      // ── Reduced motion: everything instantly visible ──────────────────────
      if (reducedMotion) {
        gsap.set(
          [
            refs.titleRef.value,
            refs.buttonRef.value,
            refs.subtitleRef.value,
            refs.sliderRef.value,
          ].filter(Boolean),
          { opacity: 1, y: 0, x: 0 },
        );
        return;
      }

      // Use gsap.from() with immediateRender:false — elements stay VISIBLE
      // in CSS until the tween actually starts playing. This prevents the
      // "invisible on load" flash that fromTo() causes when the from-state
      // is applied immediately on timeline creation.
      const tl = gsap.timeline({
        defaults: { ease: "expo.out", immediateRender: false },
        delay: 0.1,
      });

      if (refs.titleRef.value) {
        tl.from(refs.titleRef.value, { opacity: 0, y: 60, duration: 1.2 });
      }
      if (refs.buttonRef.value) {
        tl.from(refs.buttonRef.value, { opacity: 0, y: 30, duration: 0.9 }, "-=0.7");
      }
      if (refs.subtitleRef.value) {
        tl.from(refs.subtitleRef.value, { opacity: 0, y: 20, duration: 0.8 }, "-=0.6");
      }
      if (refs.sliderRef.value) {
        tl.from(refs.sliderRef.value, { opacity: 0, x: 20, duration: 0.7 }, "-=0.5");
      }

      gsap.to(refs.heroRef.value, {
        scrollTrigger: {
          trigger: refs.heroRef.value,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        yPercent: 20,
        filter: "blur(10px)",
        ease: "none",
      });

      if (refs.titleRef.value) {
        gsap.to(refs.titleRef.value, {
          scrollTrigger: {
            trigger: refs.heroRef.value,
            start: "top top",
            end: "center top",
            scrub: 1,
          },
          y: -100,
          opacity: 0,
          ease: "none",
        });
      }

      const fadeOnScroll = [refs.buttonRef.value, refs.subtitleRef.value].filter(Boolean);
      if (fadeOnScroll.length) {
        gsap.to(fadeOnScroll, {
          scrollTrigger: {
            trigger: refs.heroRef.value,
            start: "top top",
            end: "30% top",
            scrub: 1,
          },
          y: 60,
          opacity: 0,
          ease: "none",
        });
      }

      if (refs.sliderRef.value) {
        gsap.to(refs.sliderRef.value, {
          scrollTrigger: {
            trigger: refs.heroRef.value,
            start: "top top",
            end: "40% top",
            scrub: 1,
          },
          opacity: 0,
          x: 50,
          ease: "none",
        });
      }
    }, refs.heroRef.value);
  };

  const cleanup = () => {
    ctx.value?.revert();
    ctx.value = null;
  };

  return { initAnimations, cleanup };
};
