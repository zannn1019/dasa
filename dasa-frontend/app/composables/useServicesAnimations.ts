import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

export function useServicesAnimations() {
  let ctx: gsap.Context | null = null;

  // Track event listeners so we can remove them precisely on cleanup
  // (gsap.context.revert() does NOT remove DOM event listeners)
  const listeners: Array<{ el: Element; event: string; fn: EventListener }> = [];

  function addListener(el: Element, event: string, fn: EventListener) {
    el.addEventListener(event, fn);
    listeners.push({ el, event, fn });
  }

  function initAnimations(
    sectionRef: Ref<HTMLElement | null>,
    watermarkRef: Ref<HTMLElement | null>,
    headerRef: Ref<HTMLElement | null>,
    titleRef: Ref<HTMLElement | null>,
    subtitleRef: Ref<HTMLElement | null>,
    controlsRef: Ref<HTMLElement | null>,
    cardsRef: Ref<HTMLElement[]>,
  ) {
    if (!import.meta.client || !sectionRef.value) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(
          [
            watermarkRef.value,
            titleRef.value,
            subtitleRef.value,
            controlsRef.value,
            ...cardsRef.value,
          ].filter(Boolean),
          { opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0 },
        );
        return;
      }

      // ── Entrance timeline — all gsap.set calls INSIDE context so revert() restores them ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.value,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      });

      if (watermarkRef.value) {
        gsap.set(watermarkRef.value, { scale: 0.8, opacity: 0 });
        tl.to(watermarkRef.value, { scale: 1, opacity: 0.4, duration: 1, ease: "power3.out" });
      }
      if (titleRef.value) {
        gsap.set(titleRef.value, { y: 50, opacity: 0 });
        tl.to(titleRef.value, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1.2");
      }
      if (subtitleRef.value) {
        gsap.set(subtitleRef.value, { y: 30, opacity: 0 });
        tl.to(subtitleRef.value, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, "-=0.7");
      }
      if (controlsRef.value) {
        gsap.set(controlsRef.value, { scale: 0, opacity: 0 });
        tl.to(
          controlsRef.value,
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
          "-=0.5",
        );
      }

      cardsRef.value.forEach((card, index) => {
        if (!card) return;
        gsap.set(card, { opacity: 0, rotateX: -15 });
        tl.to(
          card,
          { y: 0, opacity: 1, rotateX: 0, duration: 0.2, ease: "power3.out" },
          `-=${0.6 - index * 0.1}`,
        );
      });
    }, sectionRef.value);
  }

  function createCardHoverEffect(cards: Ref<HTMLElement[]>) {
    if (!import.meta.client) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    cards.value.forEach((card) => {
      if (!card) return;

      const cardImage = card.querySelector(".card-image") as HTMLElement | null;
      const cardContent = card.querySelector(".card-content") as HTMLElement | null;

      const onEnter = () => {
        if (cardImage) gsap.to(cardImage, { scale: 1.1, duration: 0.6, ease: "power2.out" });
        if (cardContent) gsap.to(cardContent, { y: -4, duration: 0.4, ease: "power2.out" });
      };
      const onLeave = () => {
        gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
        if (cardImage) gsap.to(cardImage, { scale: 1, duration: 0.6, ease: "power2.out" });
        if (cardContent) gsap.to(cardContent, { y: 0, duration: 0.4, ease: "power2.out" });
      };

      addListener(card, "mouseenter", onEnter);
      addListener(card, "mouseleave", onLeave);
    });
  }

  function animateNavButtons(controlsRef: Ref<HTMLElement | null>) {
    if (!import.meta.client || !controlsRef.value) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const buttons = controlsRef.value.querySelectorAll(".nav-button");
    buttons.forEach((button) => {
      const onEnter = () =>
        gsap.to(button, { scale: 1.15, rotation: 5, duration: 0.3, ease: "back.out(2)" });
      const onLeave = () =>
        gsap.to(button, { scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
      const onClick = () =>
        gsap.to(button, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" });

      addListener(button, "mouseenter", onEnter);
      addListener(button, "mouseleave", onLeave);
      addListener(button, "click", onClick);
    });
  }

  function cleanup() {
    // 1. Revert all GSAP tweens / ScrollTriggers created in context
    ctx?.revert();
    ctx = null;

    // 2. Remove all DOM event listeners — gsap.context.revert() does NOT do this
    listeners.forEach(({ el, event, fn }) => el.removeEventListener(event, fn));
    listeners.length = 0;
  }

  return { initAnimations, createCardHoverEffect, animateNavButtons, cleanup };
}
