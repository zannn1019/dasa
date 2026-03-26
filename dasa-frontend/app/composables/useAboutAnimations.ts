import type { Ref } from "vue";

/**
 * useAboutAnimations
 * Manages all GSAP scroll and entrance animations for the /about page.
 * Call init() inside onMounted (after nextTick), cleanup() in onUnmounted.
 */
export function useAboutAnimations(pageRef: Ref<HTMLElement | null>) {
  let ctx: gsap.Context | null = null;

  async function init() {
    if (!pageRef.value) return;

    const { default: gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ctx = gsap.context(() => {
      if (reduced) return;

      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out", immediateRender: false },
      });

      heroTl
        .from(".ap-hero__tag", { opacity: 0, y: 16, duration: 0.6 }, 0.1)
        .from(
          ".ap-hero__divider",
          { scaleX: 0, duration: 0.7, transformOrigin: "left center" },
          0.25,
        )
        .from(".ap-hero__title", { opacity: 0, y: 40, duration: 0.9 }, 0.35)
        .from(".ap-hero__desc", { opacity: 0, y: 24, duration: 0.7 }, 0.55);

      //  GSAP only handles the initial entrance when subnav first becomes visible)

      document.querySelectorAll(".ap-section").forEach((section) => {
        const label = section.querySelector(".ap-section__label");
        const title = section.querySelector(".ap-section__title");

        if (label) {
          gsap.from(label, {
            scrollTrigger: { trigger: section, start: "top 85%", once: true },
            opacity: 0,
            x: -20,
            duration: 0.55,
            ease: "power3.out",
            immediateRender: false,
          });
        }

        if (title) {
          gsap.from(title, {
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
            opacity: 0,
            y: 28,
            duration: 0.75,
            ease: "power3.out",
            immediateRender: false,
          });
        }
      });

      gsap.from(".ap-vision__card", {
        scrollTrigger: { trigger: ".ap-vision__card", start: "top 84%", once: true },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        immediateRender: false,
      });

      gsap.from(".ap-mission__item", {
        scrollTrigger: { trigger: ".ap-mission__list", start: "top 82%", once: true },
        opacity: 0,
        x: -24,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        immediateRender: false,
      });

      gsap.from(".ap-gallery__hero", {
        scrollTrigger: { trigger: ".ap-gallery__editorial", start: "top 82%", once: true },
        opacity: 0,
        x: -32,
        duration: 0.8,
        ease: "power3.out",
        immediateRender: false,
      });

      gsap.from(".ap-gallery__thumb", {
        scrollTrigger: { trigger: ".ap-gallery__editorial", start: "top 80%", once: true },
        opacity: 0,
        y: 24,
        scale: 0.96,
        duration: 0.55,
        stagger: { amount: 0.45, from: "start" },
        ease: "power3.out",
        immediateRender: false,
      });

      gsap.from(".ap-gallery__overflow .ap-gallery__thumb", {
        scrollTrigger: { trigger: ".ap-gallery__overflow", start: "top 84%", once: true },
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        immediateRender: false,
      });

      gsap.from(".ap-certs__grid .ap-cert-card", {
        scrollTrigger: { trigger: ".ap-certs__grid", start: "top 84%", once: true },
        opacity: 0,
        y: 28,
        scale: 0.98,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        immediateRender: false,
      });

      gsap.from(".ap-contact__form", {
        scrollTrigger: { trigger: ".ap-contact__grid", start: "top 85%", once: true },
        opacity: 0,
        x: -28,
        duration: 0.7,
        ease: "power3.out",
        immediateRender: false,
      });

      gsap.from(".ap-contact__info", {
        scrollTrigger: { trigger: ".ap-contact__grid", start: "top 85%", once: true },
        opacity: 0,
        x: 28,
        duration: 0.7,
        ease: "power3.out",
        immediateRender: false,
      });

      gsap.from(".ap-contact__info-item", {
        scrollTrigger: { trigger: ".ap-contact__info", start: "top 84%", once: true },
        opacity: 0,
        y: 16,
        duration: 0.45,
        stagger: 0.1,
        ease: "power3.out",
        immediateRender: false,
      });
    }, pageRef.value);
  }

  function cleanup() {
    ctx?.revert();
    ctx = null;
  }

  return { init, cleanup };
}
