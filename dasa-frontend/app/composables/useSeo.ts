import { callWithNuxt } from '#app';

interface SeoOptions {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  noindex?: boolean;
}

export async function useSeo(options: SeoOptions) {
  const route = useRoute();
  const { getPageData, getAbsoluteImageUrl } = useCms();
  const nuxtApp = useNuxtApp();
  const { data: pageData } = await getPageData('site-setting', {
    ogImage: true
  });

  const siteData = computed(() => (pageData.value?.data || {}) as any);

  const fullTitle = computed(() => `${options.title} | ${siteData.value.name || 'Dasa'}`);
  const image = computed(() => {
    const ogImageUrl = siteData.value.ogImage?.url;
    return ogImageUrl ? getAbsoluteImageUrl(ogImageUrl) : '/images/og-cover.png';
  });
  const canonicalUrl = computed(() => `${siteData.value.siteUrl || 'https://dasa.co.id'}${route.path}`);
  
  callWithNuxt(nuxtApp, () => {
    useSeoMeta({
      title: fullTitle,
      description: options.description,
      keywords: options.keywords,

      ogTitle: fullTitle,
      ogDescription: options.description,
      ogImage: image,
      ogType: "website",
      ogUrl: canonicalUrl,
      ogSiteName: () => siteData.value.name || 'Dasa',

      twitterCard: "summary_large_image",
      twitterTitle: fullTitle,
      twitterDescription: options.description,
      twitterImage: image,
      twitterSite: () => siteData.value.twitterHandle || '@dasatech',

      robots: options.noindex ? "noindex, nofollow" : "index, follow",
    });

    useHead({
      link: [{ rel: "canonical", href: canonicalUrl }],
    });
  });
}
