<template>
  <div></div>
</template>

<script setup>
onMounted(() => {
  if (useRoute().path == "/post") {
    navigateTo("/post/new/1");
  }
});
</script>

<style></style>
