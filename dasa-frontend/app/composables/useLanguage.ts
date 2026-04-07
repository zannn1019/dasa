export function useLanguage() {
  /**
   * Return English strings directly (no language switching)
   * @param obj - Can be a string or a bilingual object (we just use the `en` property)
   */
  function t(obj: { en: string; id?: string } | string): string {
    if (typeof obj === "string") return obj;
    return obj.en ?? "";
  }

  return { t };
}
