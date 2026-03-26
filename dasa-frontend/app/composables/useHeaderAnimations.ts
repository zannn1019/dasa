import gsap from "gsap";
import { CSSPlugin } from "gsap/CSSPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

// Re-register here to guarantee the plugins are on this gsap instance
// regardless of plugin initialization order in Nuxt.
gsap.registerPlugin(CSSPlugin, ScrollTrigger);

interface HeaderRefs {
  headerRef: Ref<HTMLElement | null>;
  logoRef: Ref<HTMLElement | null>;
  navRef: Ref<HTMLElement | null>;
  actionsRef: Ref<HTMLElement | null>;
  fullscreenMenuRef: Ref<HTMLElement | null>;
}

export const useHeaderAnimations = () => {
  // Plain variable — NOT a ref, to prevent Vue's reactive proxy from
  // intercepting GSAP's revert() and causing infinite recursion.
  let ctx: gsap.Context | null = null;

  // Tracked event listeners for nav magnetic effect + menu — removed in cleanup()
  const listeners: Array<{ el: Element; event: string; fn: EventListener }> = [];

  function addListener(el: Element, event: string, fn: EventListener) {
    el.addEventListener(event, fn);
    listeners.push({ el, event, fn });
  }

  // ── Scroll-driven background — uses overwrite:true so rapid scroll
  const animateHeaderBackground = (headerRef: Ref<HTMLElement | null>, scrollY: number) => {
    if (!import.meta.client || !headerRef.value) return;

    if (scrollY > 50) {
      gsap.to(headerRef.value, {
        backgroundColor: "black",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto", // prevents stacking from rapid scroll events
      });
    } else {
      gsap.to(headerRef.value, {
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const createEntranceAnimation = (refs: HeaderRefs) => {
    if (!import.meta.client || !refs.headerRef.value) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scoped to the header element — revert() restores opacity/y on unmount
    ctx = gsap.context(() => {
      const navLinks = Array.from(refs.headerRef.value!.querySelectorAll<HTMLElement>(".nav .nav-link"));

      // Resolve to actual DOM elements — guards against Vue component instances
      const logoEl = refs.logoRef.value instanceof HTMLElement
        ? refs.logoRef.value
        : (refs.logoRef.value as any)?.$el as HTMLElement | null;
      const actionsEl = refs.actionsRef.value instanceof HTMLElement
        ? refs.actionsRef.value
        : (refs.actionsRef.value as any)?.$el as HTMLElement | null;

      if (reducedMotion) {
        gsap.set([logoEl, ...navLinks, actionsEl].filter(Boolean), {
          opacity: 1,
          y: 0,
        });
        return;
      }

      gsap.set([logoEl, ...navLinks, actionsEl].filter(Boolean), {
        opacity: 0,
        y: -30,
      });

      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });

      if (logoEl) {
        tl.to(logoEl, { y: 0, opacity: 1, duration: 1.4, ease: "expo.out" });
      }
      if (navLinks.length) {
        tl.to(
          navLinks,
          { y: 0, opacity: 1, duration: 1, stagger: { each: 0.08, ease: "power2.out" } },
          "-=1",
        );
      }
      if (actionsEl) {
        tl.to(actionsEl, { y: 0, opacity: 1, duration: 1 }, "-=0.8");
      }
    }, refs.headerRef.value);
  };

  // ── Magnetic nav effect — listeners tracked and removed in cleanup()
  const addMagneticEffect = (headerRef: Ref<HTMLElement | null>) => {
    if (!import.meta.client || !headerRef.value) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    // Scope querySelectorAll to the header element, not the whole document
    const navLinks = headerRef.value.querySelectorAll(".nav .nav-link");
    navLinks.forEach((link) => {
      const onEnter = (e: Event) =>
        gsap.to(e.currentTarget, { y: -2, duration: 0.3, ease: "power2.out" });
      const onLeave = (e: Event) =>
        gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: "power2.out" });

      addListener(link, "mouseenter", onEnter as EventListener);
      addListener(link, "mouseleave", onLeave as EventListener);
    });
  };

  const animateMenuOpen = (fullscreenMenuRef: Ref<HTMLElement | null>) => {
    if (!import.meta.client || !fullscreenMenuRef.value) return;

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();
    // gsap.set inside the timeline creates inline styles that revert() from a
    // parent context would restore — safe here because menu state is managed
    // explicitly (open/close always paired).
    tl.set(fullscreenMenuRef.value, { display: "flex" })
      .set(".fullscreen-menu__link", { y: 40, opacity: 0 })
      .set(".fullscreen-menu__actions", { y: 20, opacity: 0 })
      .set(".fullscreen-menu__footer", { y: 15, opacity: 0 })
      .to(fullscreenMenuRef.value, {
        clipPath: "circle(150% at 100% 0%)",
        duration: 0.5,
        ease: "expo.inOut",
      })
      .to(
        ".fullscreen-menu__link",
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power3.out" },
        "-=0.25",
      )
      .to(
        ".fullscreen-menu__actions",
        { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
        "-=0.2",
      )
      .to(
        ".fullscreen-menu__footer",
        { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" },
        "-=0.15",
      );

    return tl;
  };

  const animateMenuClose = (fullscreenMenuRef: Ref<HTMLElement | null>) => {
    if (!import.meta.client || !fullscreenMenuRef.value) return;

    document.body.style.overflow = "";

    const tl = gsap.timeline();
    tl.to(".fullscreen-menu__link", {
      y: -20,
      opacity: 0,
      duration: 0.2,
      stagger: 0.03,
      ease: "power2.in",
    })
      .to(
        [".fullscreen-menu__actions", ".fullscreen-menu__footer"],
        { y: -15, opacity: 0, duration: 0.2, ease: "power2.in" },
        "-=0.15",
      )
      .to(
        fullscreenMenuRef.value,
        { clipPath: "circle(0% at 100% 0%)", duration: 0.4, ease: "expo.inOut" },
        "-=0.05",
      )
      .set(fullscreenMenuRef.value, { display: "none" });

    return tl;
  };

  const initAnimations = (refs: HeaderRefs) => {
    if (!import.meta.client) return;
    createEntranceAnimation(refs);
    addMagneticEffect(refs.headerRef);
  };

  const cleanup = () => {
    // Restore GSAP-modified styles (opacity, y)
    ctx?.revert();
    ctx = null;

    // Remove all tracked DOM event listeners
    listeners.forEach(({ el, event, fn }) => el.removeEventListener(event, fn));
    listeners.length = 0;

    // Always restore scroll on cleanup in case menu was open during navigation
    document.body.style.overflow = "";
  };

  return { animateHeaderBackground, animateMenuOpen, animateMenuClose, initAnimations, cleanup };
};
