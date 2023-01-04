<template>
  <div>
    <PostVEdit @save="save" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { postStore } from "~~/stores/post.store";
import { tagStore } from "~~/stores/tag.store";
const useImage = imageStore();
const useTag = tagStore();
const usePost = postStore();
const post = usePost.post;
const loading = ref(false);
function formatData() {
  const array = Array.from(post.tag);
  const tag = [];
  array.forEach((e) => {
    tag.push(e.id);
  });
  return {
    author: post.author.id,
    content: post.content,
    series: post.series.id,
    status: [post.status.id],
    tag: tag,
    title: post.title,
    team: post.team._id,
    image_cover_url: useImage.url,
  };
}

async function save() {
  loading.value = true;
  try {
    await useTag.createAll(post.tag);
    await useImage.uploadImage();
    const id = await usePost.create(formatData());
    navigateTo(`/post/${id}`);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
