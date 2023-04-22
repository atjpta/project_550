<template>
  <div>
    <PostVEdit :data="data" @save="save" :loading="loading" />
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
const data = ref({
  course: {},
  series: {},
  team: {},
  status: "public",
  tag: new Set(),
});
const loading = ref(false);

function formatData(listtag) {
  const dataS = {
    author: data.value.author.id,
    content: data.value.content,
    title: data.value.title,
    status: data.value.status,
    image_cover_url: useImage.url ?? data.value.image_cover_url,
  };
  if (data.value.course) {
    dataS.course = data.value.course.id ?? data.value.course._id;
  }
  if (data.value.series) {
    dataS.series = data.value.series.id ?? data.value.series._id;
  }
  if (data.value.team) {
    dataS.team = data.value.team.id ?? data.value.team._id;
  }
  if (listtag) {
    const array = Array.from(data.value.tag);
    const tag = listtag;
    array.forEach((e) => {
      tag.push(e.id);
    });
    dataS.tag = tag;
  } else {
    const array = Array.from(data.value.tag);
    const tag = [];
    array.forEach((e) => {
      tag.push(e.id);
    });
    dataS.tag = tag;
  }
  return dataS;
}

async function save() {
  loading.value = true;
  try {
    if (!(data.value.content.ops[0].insert != "\n" && data.value.title)) {
      useAlert.setError("phải nhập đủ tiêu đề và nội dung");
      return;
    }
    const listtag = await useTag.createAll(data.value.tag);
    const dataSS = formatData(listtag);
    if (useImage.url) {
      await useImage.uploadImage();
      dataSS.image_cover_url = useImage.url;
    }
    const id = await usePost.create(dataSS);
    useRouter().back();
    useAlert.setSuccess("tạo bài viết thành công");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
definePageMeta({
  middleware: "guest",
});

useHead({
  title: "tạo bài viết",
});
</script>

<style></style>
