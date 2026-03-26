<script setup lang="ts">
  import contactData from "~/assets/data/contact.json";
  const { getPageData, getAbsoluteImageUrl } = useCms();

  definePageMeta({ layout: "default", footerConnector: false });

  const { data: siteResponse } = await getPageData("site-setting");
  const siteData = computed(() => {
    const raw = Array.isArray(siteResponse.value?.data) ? siteResponse.value?.data[0] : siteResponse.value?.data;
    return (raw?.attributes ?? raw ?? {}) as any;
  });

  const { data: aboutDataResponse } = await getPageData("about-section", {
    mission: {
      populate: "*",
    },
    gallery: {
      populate: "*",
    },
    certifications: {
      populate: "*",
    },
  });

  const aboutData = computed(() => {
    const raw = Array.isArray(aboutDataResponse.value?.data)
      ? aboutDataResponse.value?.data?.[0]
      : aboutDataResponse.value?.data;
    return (raw || {}) as any;
  });

  useSeo({
    title: "About Us",
    description: (aboutData.value.description as any) || "",
  });

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteData.value.name,
          url: siteData.value.siteUrl,
          description: (aboutData.value.description as any) || "",
        }),
      },
    ],
  });

  const content = computed(() => ({
    description: (aboutData.value.description as any) || "",
    vision: (aboutData.value.vision as any) || "",
    mission: ((aboutData.value.mission as any) || []).map((m: any) => m.mission),
    gallery: ((aboutData.value.gallery as any) || []).map((g: any) => ({
      src: getAbsoluteImageUrl(g.image?.url),
      alt: g.title,
    })),
    certifications: ((aboutData.value.certifications as any) || []).map((c: any) => ({
      name: c.name,
      issuer: c.issuer,
      year: c.year,
      image: getAbsoluteImageUrl(c.image?.url) ?? "",
    })),
  }));

  const sections = [
    { id: "vision", label: { en: "Vision & Mission", id: "Visi & Misi" } },
    { id: "gallery", label: { en: "Gallery", id: "Galeri" } },
    { id: "certifications", label: { en: "Certifications", id: "Sertifikasi" } },
    { id: "contact", label: { en: "Contact", id: "Kontak" } },
  ];

  const pageRef = ref<HTMLElement | null>(null);
  const heroRef = ref<HTMLElement | null>(null);
  const subnavRef = ref<HTMLElement | null>(null);
  const sectionRefs = ref<Record<string, HTMLElement | null>>({});

  const activeSection = ref("vision");
  const subnavVisible = ref(false);

  let sectionObserver: IntersectionObserver | null = null;
  let heroObserver: IntersectionObserver | null = null;

  function scrollToSection(id: string) {
    const el = sectionRefs.value[id];
    if (!el) return;
    const offset = subnavRef.value?.offsetHeight ?? 64;
    const top = el.getBoundingClientRect().top + window.scrollY - offset - 16;
    window.scrollTo({ top, behavior: "smooth" });
  }

  const { lightbox, openLightbox, closeLightbox } = useLightbox();

  const { init: initAnimations, cleanup: cleanupAnimations } = useAboutAnimations(pageRef);

  onMounted(() => {
    nextTick(() => {
      if (!pageRef.value) return;

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
            if (entry.isIntersecting)
              activeSection.value = entry.target.getAttribute("data-section") ?? "vision";
          });
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      targets.forEach((el) => sectionObserver?.observe(el));

      initAnimations();
    });
  });

  onUnmounted(() => {
    sectionObserver?.disconnect();
    heroObserver?.disconnect();
    cleanupAnimations();
  });
</script>

<template>
  <div ref="pageRef" class="ap">
    <AboutHero
      :ref="(el) => (heroRef = (el as any)?.$el ?? (el as HTMLElement))"
      :description="content.description"
    />

    <AboutSubnav
      :ref="(el) => (subnavRef = (el as any)?.$el ?? (el as HTMLElement))"
      :sections="sections"
      :active-section="activeSection"
      :visible="subnavVisible"
      @scroll-to="scrollToSection"
    />

    <div
      id="vision"
      data-section="vision"
      :ref="(el) => (sectionRefs['vision'] = el as HTMLElement)"
    >
      <AboutVisionMission :vision="content.vision" :mission="content.mission" />
    </div>

    <div
      id="gallery"
      data-section="gallery"
      :ref="(el) => (sectionRefs['gallery'] = el as HTMLElement)"
    >
      <AboutPhotoGallery :photos="content.gallery" @open-lightbox="openLightbox" />
    </div>

    <div
      id="certifications"
      data-section="certifications"
      :ref="(el) => (sectionRefs['certifications'] = el as HTMLElement)"
    >
      <AboutCertificationsSlider
        :certifications="content.certifications"
        @open-lightbox="openLightbox"
      />
    </div>

    <div
      id="contact"
      data-section="contact"
      :ref="(el) => (sectionRefs['contact'] = el as HTMLElement)"
    >
      <AboutContactSection :contact="contactData" />
    </div>

    <AppLightbox v-bind="lightbox" @close="closeLightbox" />
  </div>
</template>

<style scoped>
  .ap {
    --ap-orange: var(--color-brand-orange-darker);
    --ap-dark: #08090c;
  }

  .ap :deep(.ap-label) {
    font-family: var(--font-mono);
    font-size: var(--font-size-xs);
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--ap-orange);
    display: block;
  }

  .ap :deep(.ap-section) {
    padding: clamp(72px, 10vw, 128px) 0;
  }

  .ap :deep(.ap-section + .ap-section) {
    border-top: 1px solid var(--color-border-default);
  }

  .ap :deep(.ap-section__header) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: clamp(40px, 5.5vw, 72px);
  }

  .ap :deep(.ap-section__title) {
    font-size: clamp(2rem, 1.4rem + 2.4vw, 3.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: var(--color-text-primary);
    max-width: 18ch;
  }
</style>
