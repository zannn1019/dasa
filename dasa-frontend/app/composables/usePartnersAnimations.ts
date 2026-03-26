import gsap from "gsap";
import type { Ref } from "vue";

export const usePartnersAnimations = () => {
  // Context scopes all tweens — revert() kills the infinite loop cleanly on unmount
  let ctx: gsap.Context | null = null;

  /**
   * Create an infinite horizontal loop for the partners slider.
   * Call cleanup() in the component's onUnmounted hook.
   * @param containerRef The container element holding the slider items
   * @param speed Duration of one full loop in seconds (default: 20)
   */
  const createInfiniteLoop = (containerRef: Ref<HTMLElement | null>, speed: number = 20) => {
    if (!import.meta.client || !containerRef.value) return;

    const list = containerRef.value;

    // We assume the component duplicates the items for seamless looping,
    // so total scrollable width is 2× the content width.
    const totalWidth = list.scrollWidth / 2;

    gsap.set(list, { x: 0 });

    // Wrap in context so cleanup() can terminate the repeat:-1 tween via revert()
    ctx = gsap.context(() => {
      gsap.to(list, {
        x: -totalWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
        overwrite: true,
      });
    }, list);
  };

  const cleanup = () => {
    // revert() kills the infinite tween and restores the element's original transform
    ctx?.revert();
    ctx = null;
  };

  return {
    createInfiniteLoop,
    cleanup,
  };
};
