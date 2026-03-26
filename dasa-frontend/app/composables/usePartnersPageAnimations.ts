import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

interface PartnersPageRefs {
  pageRef: Ref<HTMLElement | null>;
  heroTagRef: Ref<HTMLElement | null>;
  heroTitleRef: Ref<HTMLElement | null>;
  heroDescRef: Ref<HTMLElement | null>;
  heroDividerRef: Ref<HTMLElement | null>;
  marqueeRef: Ref<HTMLElement | null>;
}

export function usePartnersPageAnimations() {
  let ctx: gsap.Context | null = null;

  function init(refs: PartnersPageRefs) {
    if (!import.meta.client || !refs.pageRef.value) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ctx = gsap.context(() => {
      if (reduced) return;

      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(refs.heroTagRef.value, { opacity: 0, y: 16, duration: 0.6 }, 0.1)
        .from(
          refs.heroDividerRef.value,
          { scaleX: 0, duration: 0.7, transformOrigin: "left center" },
          0.25,
        )
        .from(refs.heroTitleRef.value, { opacity: 0, y: 40, duration: 0.9 }, 0.35)
        .from(refs.heroDescRef.value, { opacity: 0, y: 24, duration: 0.7 }, 0.55);

      if (refs.marqueeRef.value) {
        const tracks = refs.marqueeRef.value.querySelectorAll(".pp-marquee__track");
        gsap.to(tracks, {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });
      }

      document.querySelectorAll(".pp-category").forEach((cat) => {
        gsap.from(cat.querySelector(".pp-category__head"), {
          scrollTrigger: { trigger: cat, start: "top 84%", once: true },
          opacity: 0,
          x: -28,
          duration: 0.65,
          ease: "power3.out",
        });
        gsap.from(cat.querySelectorAll(".pp-card"), {
          scrollTrigger: { trigger: cat, start: "top 80%", once: true },
          opacity: 0,
          y: 28,
          duration: 0.5,
          stagger: { amount: 0.35, from: "start" },
          ease: "power3.out",
        });
      });
    }, refs.pageRef.value);
  }

  function cleanup() {
    ctx?.revert();
    ctx = null;
  }

  return { init, cleanup };
}
