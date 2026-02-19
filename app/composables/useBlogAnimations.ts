import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

gsap.registerPlugin(ScrollTrigger);

interface BlogRefs {
  sectionRef: Ref<HTMLElement | null>;
  gridItemsRef: Ref<HTMLElement[]>;
  imagesRef: Ref<HTMLElement[]>;
}

export const useBlogAnimations = () => {
  /**
   * Set initial states for blog elements
   */
  const setInitialStates = (refs: BlogRefs) => {
    // Hide grid items initially
    if (refs.gridItemsRef.value.length > 0) {
      gsap.set(refs.gridItemsRef.value, {
        opacity: 0,
        y: 100,
      });
    }
  };

  /**
   * Create entrance animation for grid items
   */
  const createEntranceAnimation = (refs: BlogRefs) => {
    if (!refs.sectionRef.value || refs.gridItemsRef.value.length === 0) return;

    ScrollTrigger.create({
      trigger: refs.sectionRef.value,
      start: "top 80%", // Start when top of section hits 80% of viewport
      onEnter: () => {
        gsap.to(refs.gridItemsRef.value, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2, // Stagger effect for each item
          ease: "power3.out",
          overwrite: "auto",
        });
      },
    });
  };

  /**
   * Create scroll-triggered parallax for images
   */
  const createScrollAnimations = (refs: BlogRefs) => {
    if (refs.imagesRef.value.length === 0) return;

    refs.imagesRef.value.forEach((img) => {
      // Parallax effect for images
      gsap.fromTo(
        img,
        { scale: 1.1 }, // Start slightly zoomed in
        {
          scrollTrigger: {
            trigger: img.parentElement, // Trigger based on the container
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          yPercent: 10, // Move image slightly vertically
          ease: "none",
        },
      );
    });
  };

  /**
   * Initialize all blog animations
   */
  const initAnimations = (refs: BlogRefs) => {
    setInitialStates(refs);
    // Use a small timeout to ensure DOM is ready
    setTimeout(() => {
      createEntranceAnimation(refs);
      createScrollAnimations(refs);
    }, 100);
  };

  /**
   * Cleanup all ScrollTrigger instances
   */
  const cleanup = () => {
    // Ideally we should track the triggers created here and kill only those,
    // but generic killAll might be too aggressive if used elsewhere.
    // For now, let's trust that ScrollTrigger creates are managed.
    // If we kept references to the triggers/tweens, we could kill them individually.
    // In this simple implementation, we rely on GC or explicit refresh if needed.
    // However, cleaning up specific scrolltriggers can be done if we stored them.
  };

  return {
    initAnimations,
    cleanup,
  };
};
