<script setup lang="ts">
  const { getPageData } = useCms();
  const { data } = await getPageData("site-setting", { social: true });
  const siteData = computed(() => {
    const raw = Array.isArray(data.value?.data) ? data.value?.data[0] : data.value?.data;
    return (raw?.attributes ?? raw ?? {}) as any;
  });
  
  const socialLinks = computed(() => {
    const socialArr = siteData.value.social || [];
    return socialArr.map((s: any) => s.url).filter(Boolean);
  });

  const route = useRoute();
  const footerConnector = computed(() => route.meta.footerConnector !== false);

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteData.value.name,
          url: siteData.value.siteUrl,
          logo: `${siteData.value.siteUrl}/logo-dasa.png`,
          description: siteData.value.description,
          sameAs: socialLinks.value.length ? socialLinks.value : undefined,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["English", "Indonesian"],
          },
        }),
      },
    ],
  });
</script>

<template>
  <div class="layout-wrapper">
    <TheHeader />
    <main>
      <slot />
    </main>
    <TheFooter :footer-connector="footerConnector" />
  </div>
</template>

<style scoped>
  .layout-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }
</style>
