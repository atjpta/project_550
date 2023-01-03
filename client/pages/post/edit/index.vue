<template>
  <div>
    <PostVEdit v-model:data="data" />
  </div>
</template>

<script setup>
const data = ref({
  author: "",
  series: "",
  team: "",
  tag: "",
  title: "ergerg",
  content: {},
  cover_image_url: "",
  status: [],
});
</script>

<style></style>
