<template>
  <div>
    <PostVPost class="p-5" :data="usePost.post" />
  </div>
</template>

<script setup>
import { postStore } from "~~/stores/post.store";

const route = useRoute();
const usePost = postStore();

onMounted(() => {
  usePost.findOne(route.params.id);
});
</script>

<style></style>
