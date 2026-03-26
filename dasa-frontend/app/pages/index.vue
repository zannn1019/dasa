<script setup lang="ts">
  const { getPageData } = useCms();
  const { data } = await getPageData("site-setting");
  const siteData = computed(() => {
    const raw = Array.isArray(data.value?.data) ? data.value?.data[0] : data.value?.data;
    return (raw?.attributes ?? raw ?? {}) as any;
  });

  definePageMeta({ lenis: true });

  useSeo({
    title: "Home",
    description: siteData.value.description || "",
  });

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteData.value.name,
          url: siteData.value.siteUrl,
          description: siteData.value.description,
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteData.value.siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  });
</script>

<template>
  <div>
    <HeroSection id="home" />
    <ContentBlock id="about" />
    <ServicesSection id="services" />
    <BlogSection id="blog" />
    <PartnersSection id="clients" />
  </div>
</template>
