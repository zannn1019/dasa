/**
 * gsap.client.ts
 * Registers GSAP + CSSPlugin + ScrollTrigger once, client-side only.
 * The `.client.ts` suffix ensures this NEVER runs on the server.
 */
import gsap from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(CSSPlugin, ScrollTrigger);

  // Make ScrollTrigger aware of scroll position changes after navigation.
  // nextTick + double setTimeout ensures all components have mounted
  // and registered their ScrollTrigger instances before recalculating.
  const router = useRouter();
  router.afterEach(() => {
    //   nextTick  — Nuxt flushes the new component tree
    //   rAF × 2   — browser paints the new layout (guarantees post-paint)
    //   150 ms    — Lenis recalculates scroll height before ST.refresh()
    // This outlasts onUnmounted cleanup of the old page, preventing
    // "node is null" errors from zombie ScrollTrigger instances.
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 150);
        });
      });
    });
  });
});
