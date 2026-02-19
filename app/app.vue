<script setup lang="ts">
  const isLoading = ref(true);

  const onLoadingDone = () => {
    isLoading.value = false;
  };
</script>

<template>
  <LoadingScreen v-if="isLoading" @done="onLoadingDone" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
