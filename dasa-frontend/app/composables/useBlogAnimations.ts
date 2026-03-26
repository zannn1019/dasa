import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

interface BlogRefs {
  sectionRef: Ref<HTMLElement | null>;
  gridItemsRef: Ref<HTMLElement[]>;
  imagesRef: Ref<HTMLElement[]>;
}

export const useBlogAnimations = () => {
  let ctx: gsap.Context | null = null;

  const initAnimations = (refs: BlogRefs) => {
    if (!import.meta.client || !refs.sectionRef.value) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ctx = gsap.context(() => {
      if (reducedMotion) {
        // Skip motion — just ensure elements are fully visible immediately
        gsap.set([...refs.gridItemsRef.value, ...refs.imagesRef.value], {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
        });
        return;
      }

      if (refs.gridItemsRef.value.length > 0) {
        gsap.from(refs.gridItemsRef.value, {
          scrollTrigger: {
            trigger: refs.sectionRef.value,
            start: "top 80%",
          },
          opacity: 0,
          y: 60,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          immediateRender: false,
        });
      }

      refs.imagesRef.value.forEach((img) => {
        if (!img.parentElement) return;
        gsap.fromTo(
          img,
          { scale: 1.1 },
          {
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
            yPercent: 10,
            ease: "none",
          },
        );
      });
    }, refs.sectionRef.value);
  };

  const cleanup = () => {
    ctx?.revert();
    ctx = null;
  };

  return { initAnimations, cleanup };
};
