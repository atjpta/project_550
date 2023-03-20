<template>
  <div></div>
</template>

<script setup>
onMounted(() => {
  if (useRoute().path == "/topic") {
    navigateTo("/topic/new/0");
  }
});
</script>

<style></style>
