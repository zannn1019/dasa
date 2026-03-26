<script setup lang="ts">
  const isLoading = ref(true);
  const transitionRef = ref<InstanceType<typeof PageTransition> | null>(null);

  const onLoadingDone = () => {
    isLoading.value = false;
  };

  const pageTransition = {
    name: "page",
    mode: "out-in",
    css: false,
    onLeave(_el: Element, done: () => void) {
      transitionRef.value?.leave().then(done) ?? done();
    },
    onEnter(el: Element, done: () => void) {
      (el as HTMLElement).style.opacity = "0";
      if (transitionRef.value) {
        transitionRef.value.enter(el as HTMLElement).then(done);
      } else {
        (el as HTMLElement).style.opacity = "";
        done();
      }
    },
  };
</script>

<template>
  <LoadingScreen v-show="isLoading" @done="onLoadingDone" />
  <PageTransition ref="transitionRef" />
  <NuxtLayout>
    <NuxtPage :transition="pageTransition" />
  </NuxtLayout>
</template>
