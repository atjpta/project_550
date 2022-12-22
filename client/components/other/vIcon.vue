<template>
  <ClientOnly>
    <font-awesome-icon :class="classIcon" :icon="icon" />
  </ClientOnly>
</template>

<script setup>
const props = defineProps({
  icon: String,
  classIcon: String,
});
</script>

<style></style>
