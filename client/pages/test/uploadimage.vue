<template>
  <div>
    upload ảnh
    <div class="w-64 mx-auto">
      <div @mouseenter="openIcon = true" class="w-64 mx-auto relative">
        <img
          class="bg-black/50 h-64 w-64 rounded-full"
          :src="useImage.previewImage || data"
          alt=""
        />
        <div
          v-if="openIcon"
          @mouseleave="openIcon = false"
          class="h-full w-full btn btn-ghost rounded-full text-5xl text-base-300 absolute top-0"
        >
          <!-- <OtherVIcon icon="fa-solid fa-camera" /> -->
          <input
            @change="useImage.previewFiles($event)"
            accept="image/*"
            type="file"
            class="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />
        </div>
      </div>
      <!-- các btn -->
      <div v-if="useImage.previewImage" class="flex justify-around m-5">
        <div
          @click="saveImage()"
          :class="[loading ? 'loading' : '']"
          class="btn btn-primary btn-outline"
        >
          <OtherVIcon icon="fa-solid fa-floppy-disk" />
        </div>
        <div @click="cancel()" class="btn btn-error btn-outline">
          <OtherVIcon icon="fa-solid fa-trash-can" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
const props = defineProps({
  data: String,
  url: String,
});
const loading = ref(false);
const useImage = imageStore();
const openIcon = ref(false);
function saveImage() {
  loading.value = false;
  try {
    const url = useImage.uploadImage();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

function cancel() {
  useImage.reset();
}
</script>

<style></style>
