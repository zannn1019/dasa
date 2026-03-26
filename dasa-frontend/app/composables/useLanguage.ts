import { gsap } from "gsap";

const STORAGE_KEY = "dasa-locale";

// Global reactive locale — shared across all components (module-level singleton)
// Initialised from localStorage on first load (client only)
const locale = ref<"en" | "id">(
  (import.meta.client && (localStorage.getItem(STORAGE_KEY) as "en" | "id" | null)) || "en",
);

export function useLanguage() {
  function toggleLocale() {
    if (!import.meta.client) {
      locale.value = locale.value === "en" ? "id" : "en";
      return;
    }

    const targets = document.querySelectorAll("[data-lang]");

    // Blur out → swap locale → blur back in
    gsap.to(targets, {
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.2,
      ease: "power2.in",
      stagger: { amount: 0.06, from: "random" },
      onComplete: () => {
        locale.value = locale.value === "en" ? "id" : "en";
        localStorage.setItem(STORAGE_KEY, locale.value);

        nextTick(() => {
          gsap.to(targets, {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.25,
            ease: "power2.out",
            stagger: { amount: 0.08, from: "random" },
          });
        });
      },
    });
  }

  /**
   * Pick the right string from a bilingual object: { en: "...", id: "..." }
   * Falls back to the `en` value if the key is missing.
   */
  function t(obj: { en: string; id: string } | string): string {
    if (typeof obj === "string") return obj;
    return obj[locale.value] ?? obj.en;
  }

  return { locale, toggleLocale, t };
}
