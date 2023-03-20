<template>
  <div></div>
</template>

<script setup>
onMounted(() => {
  if (useRoute().path == "/post") {
    navigateTo("/post/new/0");
  }
});
</script>

<style></style>
