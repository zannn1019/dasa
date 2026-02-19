import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useServicesAnimations() {
  function initAnimations(
    sectionRef: Ref<HTMLElement | null>,
    watermarkRef: Ref<HTMLElement | null>,
    headerRef: Ref<HTMLElement | null>,
    titleRef: Ref<HTMLElement | null>,
    subtitleRef: Ref<HTMLElement | null>,
    controlsRef: Ref<HTMLElement | null>,
    cardsRef: Ref<HTMLElement[]>,
  ) {
    if (
      !sectionRef.value ||
      !watermarkRef.value ||
      !headerRef.value ||
      !titleRef.value ||
      !subtitleRef.value ||
      !controlsRef.value
    )
      return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    // Set initial states
    gsap.set(watermarkRef.value, { scale: 0.8, opacity: 0 });
    gsap.set(titleRef.value, { y: 50, opacity: 0 });
    gsap.set(subtitleRef.value, { y: 30, opacity: 0 });
    gsap.set(controlsRef.value, { scale: 0, opacity: 0 });

    // Entrance animations
    tl.to(watermarkRef.value, {
      scale: 1,
      opacity: 0.4,
      duration: 1,
      ease: "power3.out",
    })
      .to(
        titleRef.value,
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=1.2",
      )
      .to(
        subtitleRef.value,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.7",
      )
      .to(
        controlsRef.value,
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.5",
      );

    // Cards entrance animation
    cardsRef.value.forEach((card, index) => {
      if (card) {
        gsap.set(card, {  opacity: 0, rotateX: -15 });
        tl.to(
          card,
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          `-=${0.6 - index * 0.1}`,
        );
      }
    });
  }

  function createCardHoverEffect(cards: Ref<HTMLElement[]>) {
    cards.value.forEach((card) => {
      if (!card) return;

      const cardImage = card.querySelector(".card-image") as HTMLElement;
      const cardContent = card.querySelector(".card-content") as HTMLElement;

      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(cardImage, {
          scale: 1.1,
          duration: 0.6,
          ease: "power2.out",
        });

        gsap.to(cardContent, {
          duration: 0.4,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(cardImage, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        });

        gsap.to(cardContent, {
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      });
    });
  }

  function animateNavButtons(controlsRef: Ref<HTMLElement | null>) {
    if (!controlsRef.value) return;

    const buttons = controlsRef.value.querySelectorAll(".nav-button");

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, {
          scale: 1.15,
          rotation: 5,
          duration: 0.3,
          ease: "back.out(2)",
        });
      });

      button.addEventListener("mouseleave", () => {
        gsap.to(button, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      });

      button.addEventListener("click", () => {
        gsap.to(button, {
          scale: 0.9,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      });
    });
  }

  return {
    initAnimations,
    createCardHoverEffect,
    animateNavButtons,
  };
}
