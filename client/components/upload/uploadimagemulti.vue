<template>
  <div class="z-0">
    <div>
      <input
        ref="input"
        @change="useImage.previewListFiles($event)"
        accept="image/*"
        type="file"
        multiple
        class="file-input file-input-bordered file-input-primary w-full max-w-xs"
      />
    </div>
    <div v-for="(data, index) in listdata" :key="index" class="m-5">
      <img :src="data" alt="" />
    </div>
    <div @click="uploadListImage()" class="btn btn-primary btn-outline m-5">lưu</div>
    <div @click="cancel()" class="btn btn-error btn-outline m-5">xóa</div>
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
const useImage = imageStore();
const input = ref();
const listdata = computed(() => {
  return useImage.listPreviewImage;
});

function cancel() {
  useImage.resetList();
  input.value.value = "";
}

async function uploadListImage() {
  await useImage.uploadListImage();
}
</script>

<style></style>
