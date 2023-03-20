<template>
  <div></div>
</template>

<script setup>
onMounted(() => {
  if (useRoute().path == "/question") {
    navigateTo("/question/new/0");
  }
});
</script>

<style></style>
