<template>
  <div>
    <PostVEditS @save="save" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { postStore } from "~~/stores/post.store";
import { tagStore } from "~~/stores/tag.store";
import { alertStore } from "~~/stores/alert.store";

const useAlert = alertStore();
const useImage = imageStore();
const useTag = tagStore();
const usePost = postStore();
let post;
const loading = ref(false);

function formatData(listtag) {
  const data = {
    author: post.author.id,
    content: post.content,
    series: post.series.id,
    status: "public",
    title: post.title,
    image_cover_url: useImage.url ?? post.image_cover_url,
  };
  if (listtag) {
    const array = Array.from(post.tag);
    const tag = listtag;
    array.forEach((e) => {
      tag.push(e.id);
    });
    data.tag = tag;
  } else {
    const array = Array.from(post.tag);
    const tag = [];
    array.forEach((e) => {
      tag.push(e.id);
    });
    data.tag = tag;
  }
  return data;
}

async function save() {
  post = usePost.post_edit;
  if (!(post.content.ops[0].insert != "\n" && post.title)) {
    useAlert.setError("Phải nhập đủ tiêu đề và nội dung");
    return;
  }

  loading.value = true;
  try {
    const listtag = await useTag.createAll(post.tag);
    const data = formatData(listtag);
    if (useImage.url) {
      await useImage.uploadImage();
      data.image_cover_url = useImage.url;
    }
    const id = await usePost.create(data);
    usePost.resetPostEdit();
    useImage.url = null;

    useRouter().back();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  usePost.resetPostEdit();
});
definePageMeta({
  middleware: "guest",
});

useHead({
  title: "Tạo bài viết",
});
</script>

<style></style>
