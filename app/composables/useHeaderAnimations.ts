import gsap from "gsap";
import type { Ref } from "vue";

interface HeaderRefs {
  headerRef: Ref<HTMLElement | null>;
  logoRef: Ref<HTMLElement | null>;
  navRef: Ref<HTMLElement | null>;
  actionsRef: Ref<HTMLElement | null>;
  fullscreenMenuRef: Ref<HTMLElement | null>;
}

export const useHeaderAnimations = () => {
  /**
   * Handle scroll-based header background animation
   */
  const animateHeaderBackground = (headerRef: Ref<HTMLElement | null>, scrollY: number) => {
    if (!headerRef.value) return;

    if (scrollY > 50) {
      gsap.to(headerRef.value, {
        backgroundColor: "black",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(headerRef.value, {
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  /**
   * Create entrance animation for header elements
   */
  const createEntranceAnimation = (refs: HeaderRefs) => {
    gsap.set([refs.logoRef.value, ".nav .nav-link", refs.actionsRef.value], {
      opacity: 0,
      y: -30,
    });

    const tl = gsap.timeline({
      defaults: { ease: "expo.out", duration: 1.2 },
    });

    tl.to(refs.logoRef.value, {
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: "expo.out",
    })
      .to(
        ".nav .nav-link",
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: {
            each: 0.08,
            ease: "power2.out",
          },
        },
        "-=1",
      )
      .to(
        refs.actionsRef.value,
        {
          y: 0,
          opacity: 1,
          duration: 1,
        },
        "-=0.8",
      );

    return tl;
  };

  /**
   * Add magnetic hover effect to navigation links
   */
  const addMagneticEffect = () => {
    const navLinkElements = document.querySelectorAll(".nav .nav-link");
    
    navLinkElements.forEach((link) => {
      link.addEventListener("mouseenter", (e) => {
        gsap.to(e.target, {
          y: -2,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      
      link.addEventListener("mouseleave", (e) => {
        gsap.to(e.target, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  };

  /**
   * Animate fullscreen menu opening
   */
  const animateMenuOpen = (fullscreenMenuRef: Ref<HTMLElement | null>) => {
    if (!fullscreenMenuRef.value) return;

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();

    // Set initial states
    gsap.set(".fullscreen-menu__link", { y: 60, opacity: 0 });
    gsap.set(".fullscreen-menu__actions", { y: 30, opacity: 0 });
    gsap.set(".fullscreen-menu__footer", { y: 20, opacity: 0 });

    tl.set(fullscreenMenuRef.value, { display: "flex" })
      .to(fullscreenMenuRef.value, {
        clipPath: "circle(150% at 100% 0%)",
        duration: 0.8,
        ease: "expo.inOut",
      })
      .to(
        ".fullscreen-menu__link",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=0.4",
      )
      .to(
        ".fullscreen-menu__actions",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3",
      )
      .to(
        ".fullscreen-menu__footer",
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.2",
      );

    return tl;
  };

  /**
   * Animate fullscreen menu closing
   */
  const animateMenuClose = (fullscreenMenuRef: Ref<HTMLElement | null>) => {
    if (!fullscreenMenuRef.value) return;

    document.body.style.overflow = "";

    const tl = gsap.timeline();

    tl.to(".fullscreen-menu__link", {
      y: -30,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
    })
      .to(
        [".fullscreen-menu__actions", ".fullscreen-menu__footer"],
        {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        "-=0.2",
      )
      .to(
        fullscreenMenuRef.value,
        {
          clipPath: "circle(0% at 100% 0%)",
          duration: 0.6,
          ease: "expo.inOut",
        },
        "-=0.1",
      )
      .set(fullscreenMenuRef.value, { display: "none" });

    return tl;
  };

  /**
   * Initialize all header animations
   */
  const initAnimations = (refs: HeaderRefs) => {
    createEntranceAnimation(refs);
    addMagneticEffect();
  };

  return {
    animateHeaderBackground,
    animateMenuOpen,
    animateMenuClose,
    initAnimations,
  };
};
