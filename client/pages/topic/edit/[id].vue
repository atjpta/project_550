<template>
  <div>
    <TopicVEdit @save="save" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { topicStore } from "~~/stores/topic.store";

const useImage = imageStore();
const useTopic = topicStore();
let topic;
const loading = ref(false);

function formatData(listtag) {
  const data = {
    id: topic.id,
    status: [topic.status.id],
    name: topic.name,
    introduce: topic.introduce,
    team: topic.team._id ?? " ",
    image_cover_url: useImage.url ?? topic.image_cover_url,
  };
  return data;
}

async function save() {
  topic = useTopic.topic_edit;
  loading.value = true;
  try {
    const data = formatData();
    if (useImage.url) {
      await useImage.uploadImage();
      data.image_cover_url = useImage.url;
    }
    await useTopic.update(data);
    useTopic.resettopicEdit();
    navigateTo(`/topic/${data.id}`);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
