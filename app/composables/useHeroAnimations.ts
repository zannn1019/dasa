import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

gsap.registerPlugin(ScrollTrigger);

interface HeroRefs {
  heroRef: Ref<HTMLElement | null>;
  titleRef: Ref<HTMLElement | null>;
  subtitleRef: Ref<HTMLElement | null>;
  buttonRef: Ref<HTMLElement | null>;
  sliderRef: Ref<HTMLElement | null>;
}

export const useHeroAnimations = () => {
  /**
   * Set initial states for hero elements
   */
  const setInitialStates = (refs: HeroRefs) => {
    gsap.set([refs.titleRef.value, refs.buttonRef.value, refs.subtitleRef.value, refs.sliderRef.value], {
      opacity: 0,
      y: 40,
    });
  };

  /**
   * Create entrance animation timeline
   */
  const createEntranceAnimation = (refs: HeroRefs) => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
        duration: 1,
      },
    });

    tl.to(refs.titleRef.value, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: "power4.out",
    })
      .to(
        refs.buttonRef.value,
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=0.9",
      )
      .to(
        refs.subtitleRef.value,
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=0.8",
      )
      .to(
        refs.sliderRef.value,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
        },
        "-=0.7",
      );

    return tl;
  };

  /**
   * Create scroll-triggered parallax animations
   */
  const createScrollAnimations = (refs: HeroRefs) => {
    // Background parallax with blur
    gsap.fromTo(
      refs.heroRef.value,
      { yPercent: 0, filter: "blur(0px)" },
      {
        scrollTrigger: {
          trigger: refs.heroRef.value,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
        yPercent: 20,
        filter: "blur(10px)",
        ease: "none",
      },
    );

    // Title fade and slide
    gsap.fromTo(
      refs.titleRef.value,
      { y: 0, opacity: 1 },
      {
        scrollTrigger: {
          trigger: refs.heroRef.value,
          start: "top top",
          end: "center top",
          scrub: 1,
        },
        y: -100,
        opacity: 0,
        ease: "none",
      },
    );

    // Button and subtitle fade
    gsap.fromTo(
      [refs.buttonRef.value, refs.subtitleRef.value],
      { y: 0, opacity: 1 },
      {
        scrollTrigger: {
          trigger: refs.heroRef.value,
          start: "top top",
          end: "30% top",
          scrub: 1,
        },
        y: 60,
        opacity: 0,
        ease: "none",
      },
    );

    // Slider fade out
    gsap.fromTo(
      refs.sliderRef.value,
      { x: 0, opacity: 1 },
      {
        scrollTrigger: {
          trigger: refs.heroRef.value,
          start: "top top",
          end: "40% top",
          scrub: 1,
        },
        opacity: 0,
        x: 50,
        ease: "none",
      },
    );
  };

  /**
   * Initialize all hero animations
   */
  const initAnimations = (refs: HeroRefs) => {
    setInitialStates(refs);
    createEntranceAnimation(refs);
    createScrollAnimations(refs);
  };

  /**
   * Cleanup all ScrollTrigger instances
   */
  const cleanup = () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };

  return {
    initAnimations,
    cleanup,
    setInitialStates,
    createEntranceAnimation,
    createScrollAnimations,
  };
};
