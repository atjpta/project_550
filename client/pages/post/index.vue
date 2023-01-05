<template>
  <div class="mr-10">
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="space-x-1">
        <div v-for="i in 3" :key="i" class="btn btn-primary btn-outline btn-sm lg:btn-md">
          {{ i }} 0000
        </div>
      </div>
      <nuxt-link to="/post/edit" class="btn btn-outline btn-success btn-sm lg:btn-md">
        tạo bài viết
      </nuxt-link>
    </div>
    <div>
      <div v-for="i in usePost.list" :key="i.id">
        <PostVMono :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { postStore } from "~~/stores/post.store";

const usePost = postStore();

onMounted(() => {
  usePost.findAll();
});
</script>

<style></style>
