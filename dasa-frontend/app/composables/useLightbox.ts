export function useLightbox() {
  const lightbox = reactive({ open: false, src: "", alt: "" });

  function openLightbox(src: string, alt: string) {
    lightbox.src = src;
    lightbox.alt = alt;
    lightbox.open = true;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.open = false;
    document.body.style.overflow = "";
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") closeLightbox();
  }

  onMounted(() => window.addEventListener("keydown", onKeydown));
  onUnmounted(() => window.removeEventListener("keydown", onKeydown));

  return { lightbox, openLightbox, closeLightbox };
}
