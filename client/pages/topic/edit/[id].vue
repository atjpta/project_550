<template>
  <div>
    <TopicVEdit @save="save" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { topicStore } from "~~/stores/topic.store";
import { alertStore } from "~~/stores/alert.store";

const useAlert = alertStore();
const useImage = imageStore();
const useTopic = topicStore();
let topic;
const loading = ref(false);

function formatData() {
  const data = {
    id: topic.id,
    name: topic.name,
    introduce: topic.introduce,
    image_cover_url: useImage.url ?? topic.image_cover_url,
  };
  return data;
}

async function save() {
  topic = useTopic.topic_edit;
  if (!(topic.introduce && topic.name)) {
    useAlert.setError("Phải nhập đủ tên và tóm tắt ");
    return;
  }
  loading.value = true;
  try {
    const data = formatData();
    if (useImage.url) {
      await useImage.uploadImage();
      data.image_cover_url = useImage.url;
    }
    await useTopic.update(data);
    useTopic.resettopicEdit();
    useImage.url = null;

    useRouter().back();
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
  title: "Sửa chủ đề",
});
</script>

<style></style>
