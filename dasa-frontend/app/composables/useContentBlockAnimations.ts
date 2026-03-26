import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

interface ContentBlockRefs {
  sectionRef: Ref<HTMLElement | null>;
  statsRef: Ref<HTMLElement[]>;
  titleRef: Ref<HTMLElement | null>;
  mainTitleRef: Ref<HTMLElement | null>;
  descRef: Ref<HTMLElement | null>;
  servicesRef: Ref<HTMLElement[]>;
}

export const useContentBlockAnimations = () => {
  let ctx: gsap.Context | null = null;

  const initAnimations = (refs: ContentBlockRefs) => {
    if (!import.meta.client || !refs.sectionRef.value) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(
          [
            refs.titleRef.value,
            refs.mainTitleRef.value,
            refs.descRef.value,
            ...refs.servicesRef.value,
            ...refs.statsRef.value,
          ].filter(Boolean),
          { opacity: 1, y: 0, x: 0, scale: 1 },
        );
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: refs.sectionRef.value,
          start: "top 70%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out", duration: 1 },
      });

      if (refs.titleRef.value) {
        tl.from(refs.titleRef.value, { opacity: 0, y: 20, duration: 0.8, immediateRender: false });
      }
      if (refs.mainTitleRef.value) {
        tl.from(
          refs.mainTitleRef.value,
          { opacity: 0, y: 30, duration: 1, immediateRender: false },
          "-=0.5",
        );
      }
      if (refs.descRef.value) {
        tl.from(
          refs.descRef.value,
          { opacity: 0, y: 20, duration: 0.9, immediateRender: false },
          "-=0.7",
        );
      }
      if (refs.servicesRef.value.length) {
        tl.from(
          refs.servicesRef.value,
          { opacity: 0, x: -30, duration: 0.8, stagger: 0.1, immediateRender: false },
          "-=0.5",
        );
      }
      if (refs.statsRef.value.length) {
        tl.from(
          refs.statsRef.value,
          { opacity: 0, y: 40, scale: 0.9, duration: 0.9, stagger: 0.15, immediateRender: false },
          "-=0.6",
        );
      }

      // ── Counter animation — MUST be inside gsap.context() to be cleaned up on revert() ──
      refs.statsRef.value.forEach((stat) => {
        const numberElement = stat.querySelector(".stat-number");
        if (!numberElement) return;

        const text = numberElement.textContent || "";
        const hasPlus = text.includes("+");
        const hasPercent = text.includes("%");
        const numericValue = parseInt(text.replace(/\D/g, ""), 10);
        const originalText = text;

        // ScrollTrigger.create inside gsap.context is tracked and killed on revert()
        ScrollTrigger.create({
          trigger: stat,
          start: "top 80%",
          onEnter: () => {
            numberElement.textContent = "0" + (hasPlus ? "+" : "") + (hasPercent ? "%" : "");
            gsap.to(
              { value: 0 },
              {
                value: numericValue,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                  const v = Math.round(this.targets()[0].value);
                  numberElement.textContent = v + (hasPlus ? "+" : "") + (hasPercent ? "%" : "");
                },
              },
            );
          },
          onLeaveBack: () => {
            numberElement.textContent = originalText;
          },
        });
      });

      refs.servicesRef.value.forEach((service, index) => {
        const icon = service.querySelector(".icon");
        if (icon) {
          gsap.to(icon, {
            y: -5,
            duration: 2 + index * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }
      });
    }, refs.sectionRef.value);
  };

  const cleanup = () => {
    // revert() kills ALL tweens, timelines, and ScrollTrigger instances
    // created inside the context — including the counter triggers above
    ctx?.revert();
    ctx = null;
  };

  return { initAnimations, cleanup };
};
