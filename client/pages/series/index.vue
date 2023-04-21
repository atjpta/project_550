<template>
  <div></div>
</template>

<script setup>
onMounted(() => {
  if (useRoute().path == "/series") {
    navigateTo("/series/new/1");
  }
});
</script>

<style></style>
