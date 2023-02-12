<template>
  <div>
    <SeriesVEditT @save="save" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { seriesStore } from "~~/stores/series.store";

const useImage = imageStore();
const useSeries = seriesStore();
let series;
const loading = ref(false);

function formatData(listtag) {
  const data = {
    author: series.author.id,
    status: [series.status.id],
    name: series.name,
    introduce: series.introduce,
    team: series.team._id,
    image_cover_url: useImage.url ?? series.image_cover_url,
  };
  return data;
}

async function save() {
  series = useSeries.series_edit;
  loading.value = true;
  try {
    const data = formatData();
    if (useImage.url) {
      await useImage.uploadImage();
      data.image_cover_url = useImage.url;
    }
    const id = await useSeries.create(data);
    useSeries.resetSeriesEdit();
    navigateTo(`/series/${id}`);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
