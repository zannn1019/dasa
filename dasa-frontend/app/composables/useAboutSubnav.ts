export interface SubnavSection {
  id: string;
  label: { en: string; id?: string };
}

export function useAboutSubnav(sections: SubnavSection[]) {
  const activeSection = ref(sections[0]?.id ?? "");
  const subnavVisible = ref(false);
  const heroRef = ref<HTMLElement | null>(null);
  const subnavRef = ref<HTMLElement | null>(null);
  const sectionRefs = ref<Record<string, HTMLElement | null>>({});

  let sectionObserver: IntersectionObserver | null = null;
  let heroObserver: IntersectionObserver | null = null;

  function scrollToSection(id: string) {
    const el = sectionRefs.value[id];
    if (!el) return;
    const offset = subnavRef.value?.offsetHeight ?? 64;
    const top = el.getBoundingClientRect().top + window.scrollY - offset - 16;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function init() {
    if (heroRef.value) {
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry) subnavVisible.value = !entry.isIntersecting;
        },
        { threshold: 0.1 },
      );
      heroObserver.observe(heroRef.value);
    }

    const targets = sections
      .map((s) => sectionRefs.value[s.id])
      .filter((el): el is HTMLElement => !!el);

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.getAttribute("data-section") ?? sections[0]!.id;
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    targets.forEach((el) => sectionObserver!.observe(el));
  }

  function cleanup() {
    sectionObserver?.disconnect();
    heroObserver?.disconnect();
  }

  return { activeSection, subnavVisible, heroRef, subnavRef, sectionRefs, scrollToSection, init, cleanup };
}
