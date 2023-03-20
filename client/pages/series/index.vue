<template>
  <div></div>
</template>

<script setup>
onMounted(() => {
  if (useRoute().path == "/series") {
    navigateTo("/series/new/0");
  }
});
</script>

<style></style>
