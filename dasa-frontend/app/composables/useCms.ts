type PopulateObject = Record<string, any>;

export const useCms = () => {
  const { find } = useStrapi();
  const { locale } = useLanguage();
  const config = useRuntimeConfig();

  // Get Strapi base URL from runtime configuration
  const strapiUrl = config.public.strapiUrl || "http://localhost:1337";

  /**
   * Convert relative Strapi image URL to absolute URL
   * @param url - Image URL from Strapi (e.g., '/uploads/image.png' or 'https://...')
   * @returns Absolute URL (e.g., 'http://localhost:1337/uploads/image.png')
   * @example
   * const absoluteUrl = getAbsoluteImageUrl('/uploads/logo.png')
   * // returns: 'http://localhost:1337/uploads/logo.png'
   */
  const getAbsoluteImageUrl = (url?: string): string => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${strapiUrl}${url}`;
    return `${strapiUrl}/${url}`;
  };

  /**
   * Fetch page data with locale and optional nested populate support.
   * Automatically refreshes when locale changes (no page reload needed).
   * Falls back to 'en' locale if current locale data doesn't exist.
   * @param contentType - The Strapi content type (e.g., 'pages', 'hero-section')
   * @param populateList - Optional populate object for nested relations/components
   * @example
   * // Simple populate (no nesting)
   * getPageData('pages')
   * // With nested populate for deep relations
   * getPageData('pages', {
   *   categories: {
   *     populate: {
   *       slides: { populate: { image: true } }
   *     }
   *   }
   * })
   */
  const getPageData = async (contentType: string, params: PopulateObject = {}) => {
    // Generate cache key
    const populateKey = JSON.stringify(params) || "default";
    const asyncDataKey = computed(() => `${contentType}-${populateKey}-${locale.value}`);

    const reservedKeys = [
      "pagination",
      "sort",
      "filters",
      "publicationState",
      "fields",
      "populate",
    ];
    const queryPayload: Record<string, any> = { locale: locale.value };
    const implicitPopulate = { ...params };

    for (const key of reservedKeys) {
      if (key in params) {
        queryPayload[key] = params[key];
        delete implicitPopulate[key];
      }
    }

    if (!queryPayload.populate && Object.keys(implicitPopulate).length > 0) {
      queryPayload.populate = implicitPopulate;
    }

    // Resolves nested objects correctly into bracket notation so `ofetch` serializes them perfectly
    const flattenParams = (obj: any, prefix = ''): Record<string, any> => {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        const newKey = prefix ? `${prefix}[${key}]` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(result, flattenParams(value, newKey));
        } else {
          result[newKey] = value;
        }
      }
      return result;
    };
    const finalPayload = flattenParams(queryPayload);

    const result = await useAsyncData(asyncDataKey.value, async () => {
      const data = await find(contentType as any, finalPayload);

      if (!data || !data.data) {
        console.warn(
          `No data found for locale '${locale.value}' in '${contentType}', falling back to 'en'`,
        );
        return find(contentType as any, { ...queryPayload, locale: "en" });
      }

      return data;
    });

    watch(locale, () => {
      result.refresh();
    });

    return result;
  };

  return {
    getPageData,
    getAbsoluteImageUrl,
  };
};
