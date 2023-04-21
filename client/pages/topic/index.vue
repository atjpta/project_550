<template>
  <div></div>
</template>

<script setup>
onMounted(() => {
  if (useRoute().path == "/topic") {
    navigateTo("/topic/new/1");
  }
});
</script>

<style></style>
