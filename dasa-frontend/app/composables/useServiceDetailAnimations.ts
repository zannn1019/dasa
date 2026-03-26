import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

interface ServiceDetailRefs {
  pageRootRef: Ref<HTMLElement | null>;
  heroTaglineRef: Ref<HTMLElement | null>;
  heroTitleRef: Ref<HTMLElement | null>;
  heroNumRef: Ref<HTMLElement | null>;
  heroDescRef: Ref<HTMLElement | null>;
  heroDividerRef: Ref<HTMLElement | null>;
  overviewTextRef: Ref<HTMLElement | null>;
  overviewNumRef: Ref<HTMLElement | null>;
  capsGridRef: Ref<HTMLElement | null>;
  ctaTextRef: Ref<HTMLElement | null>;
}

export function useServiceDetailAnimations() {
  let ctx: gsap.Context | null = null;

  function init(refs: ServiceDetailRefs) {
    if (!import.meta.client || !refs.pageRootRef.value) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(
          [
            refs.heroTaglineRef.value,
            refs.heroDividerRef.value,
            refs.heroNumRef.value,
            refs.heroTitleRef.value,
            refs.heroDescRef.value,
            refs.overviewTextRef.value,
            refs.ctaTextRef.value,
          ].filter(Boolean),
          { opacity: 1, y: 0, x: 0, clipPath: "none", scaleX: 1 },
        );
        return;
      }

      if (refs.heroTaglineRef.value) {
        const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });

        heroTl
          .fromTo(
            refs.heroTaglineRef.value,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.9 },
          )
          .fromTo(
            refs.heroDividerRef.value,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.7 },
            "-=0.3",
          )
          .fromTo(
            refs.heroNumRef.value,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            "-=0.5",
          )
          .fromTo(
            refs.heroTitleRef.value,
            { y: 120, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2 },
            "<",
          )
          .fromTo(
            refs.heroDescRef.value,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            "-=0.6",
          );
      }

      if (refs.overviewTextRef.value) {
        gsap.from(refs.overviewTextRef.value, {
          scrollTrigger: { trigger: refs.overviewTextRef.value, start: "top 80%" },
          y: 50,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          immediateRender: false,
        });
      }

      if (refs.capsGridRef.value) {
        const cards = gsap.utils.toArray<HTMLElement>(
          refs.capsGridRef.value.querySelectorAll(".sd-cap-card"),
        );
        cards.forEach((card, i) => {
          const fromLeft = i % 2 === 0;
          gsap.fromTo(
            card,
            { x: fromLeft ? -60 : 60, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 85%" },
              delay: (i % 2) * 0.1,
            },
          );
        });
      }

      if (refs.ctaTextRef.value) {
        const words = refs.ctaTextRef.value.querySelectorAll(".word");
        if (words.length) {
          gsap.from(words, {
            scrollTrigger: { trigger: refs.ctaTextRef.value, start: "top 80%" },
            y: 60,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            immediateRender: false,
          });
        }
      }
    }, refs.pageRootRef.value);
  }

  function cleanup() {
    ctx?.revert();
    ctx = null;
  }

  return { init, cleanup };
}
