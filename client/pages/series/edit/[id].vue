<template>
  <div>
    <SeriesVEdit @save="save" :loading="loading" />
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
    id: series.id,
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
    useAlert.setError("phải nhập đủ tên và tóm tắt");
    return;
  }
  loading.value = true;
  try {
    const data = formatData();
    if (useImage.url) {
      await useImage.uploadImage();
      data.image_cover_url = useImage.url;
    }
    await useSeries.update(data);
    useSeries.resetSeriesEdit();
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
  title: "sửa chuỗi bài viết",
});
</script>

<style></style>
