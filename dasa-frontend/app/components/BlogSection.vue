<script setup lang="ts">
  import { useBlogAnimations } from "~/composables/useBlogAnimations";

  const { getPageData } = useCms();

  const sectionRef = ref<HTMLElement | null>(null);
  const gridItemsRef = shallowRef<HTMLElement[]>([]);
  const imagesRef = shallowRef<HTMLElement[]>([]);

  const { initAnimations, cleanup } = useBlogAnimations();

  async function getMediumData(rssFeedUrl: string, itemsToShow: number) {
    try {
      const response = await fetch(rssFeedUrl);
      const json = await response.json();
      json.items.forEach((item: any) => {
        if (item.thumbnail === "") {
          const match = item.description.match(/src="([^"]+)"/);
          if (match) item.thumbnail = match[1];
        }
      });
      return json.items.slice(0, itemsToShow);
    } catch {
      return [];
    }
  }

  const { data, pending, error: cmsError } = await useAsyncData("blog-section", async () => {
    try {
      const { data: cmsData } = await getPageData("blog-setting");
      const raw = cmsData.value as any;
      const attrs = raw?.data?.attributes ?? raw?.data ?? null;

      if (!attrs?.rssFeedUrl) {
        console.warn("[BlogSection] No blog-setting data from CMS, skipping fetch.");
        return [];
      }

      return await getMediumData(attrs.rssFeedUrl, attrs.itemsToShow ?? 2);
    } catch (err) {
      console.error("[BlogSection] Failed to load blog config from CMS:", err);
      return [];
    }
  });

  onMounted(async () => {
    await nextTick();
    if (data.value && data.value.length > 0) {
      initAnimations({ sectionRef, gridItemsRef, imagesRef });
    }
  });

  onUnmounted(() => {
    cleanup();
  });
</script>

<template>
  <section class="blog-section" ref="sectionRef">
    <div class="container-fluid">
      <div
        v-for="(item, index) in (data as any[])"
        :key="item.link"
        class="grid-container"
        :class="{ reverse: (index as number) % 2 !== 0 }"
        :style="{ '--thumb': `url('${item.thumbnail}')` }"
        ref="gridItemsRef"
      >
        <div class="grid-item image-item">
          <img :src="item.thumbnail" :alt="item.title" ref="imagesRef" />
        </div>
        <div class="grid-item text-item bg-black">
          <div class="content">
            <h2 class="title">{{ item.title }}</h2>
            <p class="description">
              {{ item.description?.replace(/<[^>]*>/g, "").slice(0, 150) }}...
            </p>
            <BaseButton
              variant="outline"
              size="md"
              radius="sm"
              :href="item.link"
              target="_blank"
              :aria-label="`Read article: ${item.title}`"
            >
              Read More
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .blog-section {
    width: 100%;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    background-color: #000000;
  }

  .grid-container.reverse .image-item {
    order: 2;
  }

  .grid-container.reverse .text-item {
    order: 1;
  }

  .grid-item {
    width: 100%;
    height: 600px;
    position: relative;
    overflow: hidden;
    box-shadow:
      inset 0 0 20px rgba(0, 0, 0, 0.05),
      inset 0 0 40px rgba(0, 0, 0, 0.1),
      inset 0 0 80px rgba(0, 0, 0, 0.2),
      inset 0 0 160px rgba(0, 0, 0, 0.4);
  }

  .image-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .text-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-16);
    color: var(--dt-white);
  }

  .bg-black {
    background-color: #000000;
  }

  .content {
    max-width: 700px;
    text-align: left;
  }

  .title {
    font-size: var(--font-size-4xl);
    font-weight: 300;
    margin-bottom: var(--spacing-4);
    line-height: 1.2;
  }

  .description {
    font-size: var(--font-size-base);
    color: #cccccc;
    margin-bottom: var(--spacing-8);
    line-height: 1.6;
  }

  .btn-outline {
    display: inline-block;
    padding: 10px 30px;
    border: 1px solid var(--dt-white);
    color: var(--dt-white);
    text-transform: uppercase;
    font-size: var(--font-size-sm);
    letter-spacing: 1px;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .btn-outline:hover {
    background-color: var(--dt-white);
    color: #000000;
  }

  @media (max-width: 1024px) {
    .grid-container {
      grid-template-columns: 1fr;
    }

    /* Hide the standalone image column */
    .grid-item.image-item {
      display: none;
    }

    /* Text panel becomes full-width with thumbnail as darkened background */
    .grid-item.text-item {
      order: 1 !important;
      min-height: 600px;
      padding: clamp(2rem, 6vw, 4rem) clamp(1.25rem, 5vw, 3rem);
      background-image: linear-gradient(rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.72)), var(--thumb);
      background-size: cover;
      background-position: center;
      background-color: #000;
    }

    .content {
      max-width: 100%;
    }

    .title {
      font-size: var(--font-size-3xl);
    }
  }

  @media (max-width: 640px) {
    .grid-item {
      height: auto;
    }

    .grid-item.text-item {
      min-height: 480px;
      padding: 2rem 1.25rem;
    }

    .title {
      font-size: var(--font-size-2xl);
    }
  }
</style>
