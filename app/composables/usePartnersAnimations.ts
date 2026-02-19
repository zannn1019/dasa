import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

gsap.registerPlugin(ScrollTrigger);

export const usePartnersAnimations = () => {
  /**
   * Create an infinite horizontal loop for the partners slider
   * @param containerRef The container element holding the slider items
   * @param speed Duration of one full loop in seconds (default: 20)
   */
  const createInfiniteLoop = (containerRef: Ref<HTMLElement | null>, speed: number = 20) => {
    if (!containerRef.value) return;

    const list = containerRef.value;
    const items = gsap.utils.toArray(list.children) as HTMLElement[];

    // Clone items to ensure seamless loop if not enough width, or just rely on CSS duplication?
    // Creating a GSAP-managed loop is smoother.
    // Let's use a simple approach: move the list to x: "-50%" assuming the list contains two sets of items.

    // We assume the component duplicates the items for seamless looping.
    // So the total width is 2x the content width.

    // Reset position
    gsap.set(list, { x: 0 });

    const totalWidth = list.scrollWidth / 2; // Assuming duplication

    const animation = gsap.to(list, {
      x: -totalWidth,
      duration: speed,
      ease: "none",
      repeat: -1,
      overwrite: true,

      // Pause on hover can be handled via event listeners on the element calling .pause() / .play()
    });

    return animation;
  };

  const cleanup = () => {
    // Kill all specific tweens if tracked, or rely on component unmount
  };

  return {
    createInfiniteLoop,
    cleanup,
  };
};
