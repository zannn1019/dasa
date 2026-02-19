<script setup lang="ts">
  import { useBlogAnimations } from "~/composables/useBlogAnimations";

  const data = ref<any[]>([]);
  const sectionRef = ref<HTMLElement | null>(null);
  const gridItemsRef = ref<HTMLElement[]>([]);
  const imagesRef = ref<HTMLElement[]>([]);

  const { initAnimations, cleanup } = useBlogAnimations();

  async function getMediumData() {
    try {
      const response = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@medianraya",
      );
      const json = await response.json();
      json.items.forEach((item: any) => {
        if (item.thumbnail == "") {
          const match = item.description.match(/src="([^"]+)"/);
          if (match) item.thumbnail = match[1];
        }
      });
      return json.items.slice(0, 2);
    } catch (e) {
      console.error("Failed to fetch medium data", e);
      return [];
    }
  }

  onMounted(async () => {
    data.value = await getMediumData();

    // Wait for DOM update after data is loaded
    nextTick(() => {
      initAnimations({
        sectionRef,
        gridItemsRef,
        imagesRef,
      });
    });
  });

  onUnmounted(() => {
    cleanup();
  });
</script>

<template>
  <section class="blog-section" ref="sectionRef">
    <div class="container-fluid">
      <div
        v-for="(item, index) in data"
        :key="item.link"
        class="grid-container"
        :class="{ reverse: index % 2 !== 0 }"
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
            <BaseButton variant="outline" size="md" radius="sm" :href="item.link" target="_blank">
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

  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: 1fr;
    }

    .grid-item {
      height: auto;
      min-height: 400px;
    }

    .text-item {
      order: 2;
      min-height: 300px;
    }
  }
</style>
