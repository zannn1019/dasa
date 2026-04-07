<script setup lang="ts">
  export interface GalleryItem {
    src: string;
    alt: string;
  }

  defineProps<{ photos: GalleryItem[] }>();
  defineEmits<{ openLightbox: [src: string, alt: string] }>();
</script>

<template>
  <section class="ap-gallery">
    <div class="container">
      <div class="ap-section__header">
        <span class="ap-label">Gallery</span>
        <h2 class="ap-section__title">
          Behind the scenes
        </h2>
      </div>

      <div class="ap-gallery__editorial">
        <button
          v-if="photos[0]?.src"
          class="ap-gallery__hero"
          :aria-label="`View ${photos[0].alt}`"
          @click="$emit('openLightbox', photos[0].src, photos[0].alt)"
        >
          <img :src="photos[0].src" :alt="photos[0].alt" class="ap-gallery__img" loading="eager" />
          <div class="ap-gallery__zoom" aria-hidden="true"><IconExpand /></div>
        </button>

        <div class="ap-gallery__quad">
          <button
            v-for="(photo, i) in photos.slice(1, 5)"
            :key="i"
            class="ap-gallery__thumb"
            :aria-label="`View ${photo.alt}`"
            :disabled="!photo.src"
            @click="photo.src && $emit('openLightbox', photo.src, photo.alt)"
          >
            <img
              v-if="photo.src"
              :src="photo.src"
              :alt="photo.alt"
              class="ap-gallery__img"
              loading="lazy"
            />
            <div v-if="photo.src" class="ap-gallery__zoom" aria-hidden="true"><IconExpand /></div>
          </button>
        </div>
      </div>

      <div v-if="photos.length > 5" class="ap-gallery__overflow">
        <button
          v-for="(photo, i) in photos.slice(5)"
          :key="i"
          class="ap-gallery__thumb ap-gallery__thumb--sm"
          :aria-label="`View ${photo.alt}`"
          :disabled="!photo.src"
          @click="photo.src && $emit('openLightbox', photo.src, photo.alt)"
        >
          <img
            v-if="photo.src"
            :src="photo.src"
            :alt="photo.alt"
            class="ap-gallery__img"
            loading="lazy"
          />
          <div v-if="photo.src" class="ap-gallery__zoom" aria-hidden="true"><IconExpand /></div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .ap-gallery {
    padding: clamp(72px, 10vw, 128px) 0;
    border-top: 1px solid var(--color-border-default);
  }

  .ap-gallery__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
    display: block;
  }

  .ap-gallery__editorial {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 20px;
    height: 580px;
  }

  .ap-gallery__hero {
    border: none;
    padding: 0;
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    display: block;
    height: 100%;
  }

  .ap-gallery__hero:hover .ap-gallery__img,
  .ap-gallery__thumb:hover .ap-gallery__img {
    transform: scale(1.05);
  }

  .ap-gallery__quad {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 20px;
  }

  .ap-gallery__thumb {
    border: none;
    padding: 0;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    display: block;
  }

  .ap-gallery__overflow {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 20px;
  }

  .ap-gallery__thumb--sm {
    aspect-ratio: 4 / 3;
  }

  .ap-gallery__zoom {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
    pointer-events: none;
  }

  .ap-gallery__hero:hover .ap-gallery__zoom,
  .ap-gallery__thumb:hover .ap-gallery__zoom {
    background: rgba(0, 0, 0, 0.35);
  }

  .ap-gallery__zoom :deep(svg) {
    width: 28px;
    height: 28px;
    color: #fff;
    opacity: 0;
    transform: scale(0.8);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .ap-gallery__hero:hover .ap-gallery__zoom :deep(svg),
  .ap-gallery__thumb:hover .ap-gallery__zoom :deep(svg) {
    opacity: 1;
    transform: scale(1);
  }

  @media (max-width: 1024px) {
    .ap-gallery__editorial {
      height: 420px;
    }
    .ap-gallery__overflow {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .ap-gallery__editorial {
      grid-template-columns: 1fr;
      height: auto;
    }
    .ap-gallery__hero {
      aspect-ratio: 16 / 9;
    }
    .ap-gallery__quad {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: unset;
      grid-auto-rows: 160px;
    }
    .ap-gallery__overflow {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .ap-gallery__quad {
      grid-template-columns: 1fr;
      grid-auto-rows: 180px;
    }
    .ap-gallery__overflow {
      grid-template-columns: 1fr;
    }
  }
</style>
