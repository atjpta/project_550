<template>
  <div>
    <SeriesVEdit :data="data" @save="save" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { seriesStore } from "~~/stores/series.store";
import { alertStore } from "~~/stores/alert.store";

const useAlert = alertStore();
const useImage = imageStore();
const useSeries = seriesStore();
let series;
const loading = ref(false);
function formatData() {
  const data = {
    author: series.author.id,
    status: series.status,
    name: series.name,
    introduce: series.introduce,
    image_cover_url: useImage.url ?? series.image_cover_url,
  };
  return data;
}

async function save() {
  series = useSeries.series_edit;
  if (!(series.introduce && series.name)) {
    useAlert.setError("Phải nhập đủ tên và tóm tắt");
    return;
  }
  loading.value = true;
  try {
    const data = formatData();
    if (useImage.url) {
      await useImage.uploadImage();
      data.image_cover_url = useImage.url;
    }
    const id = await useSeries.create(data);
    useSeries.resetSeriesEdit();
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

const title = computed(() => {
  return useQuestion.question.title;
});

useHead({
  title: "Tạo chuỗi bài viết",
});
</script>

<style></style>
