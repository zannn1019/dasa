import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Ref } from "vue";

gsap.registerPlugin(ScrollTrigger);

interface ContentBlockRefs {
  sectionRef: Ref<HTMLElement | null>;
  statsRef: Ref<HTMLElement[]>;
  titleRef: Ref<HTMLElement | null>;
  mainTitleRef: Ref<HTMLElement | null>;
  descRef: Ref<HTMLElement | null>;
  servicesRef: Ref<HTMLElement[]>;
}

export const useContentBlockAnimations = () => {
  /**
   * Initialize content block animations
   */
  const initAnimations = (refs: ContentBlockRefs) => {
    // Set initial states
    gsap.set(refs.titleRef.value, {
      opacity: 0,
      y: 20,
    });

    gsap.set(refs.mainTitleRef.value, {
      opacity: 0,
      y: 30,
    });

    gsap.set(refs.descRef.value, {
      opacity: 0,
      y: 20,
    });

    gsap.set(refs.statsRef.value, {
      opacity: 0,
      y: 40,
      scale: 0.9,
    });

    gsap.set(refs.servicesRef.value, {
      opacity: 0,
      x: -30,
    });

    // Create scroll-triggered timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: refs.sectionRef.value,
        start: "top 70%",
        end: "top 30%",
        toggleActions: "play none none reverse",
      },
      defaults: {
        ease: "power3.out",
        duration: 1,
      },
    });

    // Animate content in sequence
    tl.to(refs.titleRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
    })
      .to(
        refs.mainTitleRef.value,
        {
          opacity: 1,
          y: 0,
          duration: 1,
        },
        "-=0.5",
      )
      .to(
        refs.descRef.value,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
        },
        "-=0.7",
      )
      .to(
        refs.servicesRef.value,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1,
        },
        "-=0.5",
      )
      .to(
        refs.statsRef.value,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
        },
        "-=0.6",
      );

    // Counter animation for stats
    refs.statsRef.value.forEach((stat) => {
      const numberElement = stat.querySelector(".stat-number");
      if (!numberElement) return;

      const text = numberElement.textContent || "";
      const hasPlus = text.includes("+");
      const hasPercent = text.includes("%");
      const numericValue = parseInt(text.replace(/\D/g, ""), 10);

      // Store original value
      const originalText = text;

      ScrollTrigger.create({
        trigger: stat,
        start: "top 80%",
        onEnter: () => {
          // Set to 0 first
          numberElement.textContent = "0" + (hasPlus ? "+" : "") + (hasPercent ? "%" : "");
          
          // Animate to the actual value
          gsap.to(
            { value: 0 },
            {
              value: numericValue,
              duration: 2,
              ease: "power2.out",
              onUpdate: function () {
                const currentValue = Math.round(this.targets()[0].value);
                let displayValue = currentValue.toString();
                if (hasPlus) displayValue += "+";
                if (hasPercent) displayValue += "%";
                numberElement.textContent = displayValue;
              },
            },
          );
        },
        onLeaveBack: () => {
          // Reset to original value when scrolling back up
          numberElement.textContent = originalText;
        },
      });
    });

    // Parallax effect for inverted container
    const invertedElement = refs.sectionRef.value?.querySelector(".inverted");
    if (invertedElement) {
      gsap.fromTo(
        invertedElement,
        { y: 50 },
        {
          scrollTrigger: {
            trigger: refs.sectionRef.value,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          y: -50,
          ease: "none",
        },
      );
    }

    // Floating animation for service icons
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
  };
};
