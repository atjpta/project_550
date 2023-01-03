<template>
  <div>
    <!-- xem trước ảnh -->
    <transition name="bounce">
      <div>
        <img
          class="bg-black/50 rounded-2xl my-2 mx-auto"
          :src="useImage.previewImage || data"
          alt=""
        />
      </div>
    </transition>
    <!-- input ảnh -->
    <div class="flex justify-between">
      <input
        @change="useImage.previewFiles($event)"
        accept="image/*"
        type="file"
        class="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-xs"
      />
      <div
        v-if="useImage.previewImage"
        @click="cancel()"
        class="ml-1 btn btn-outline btn-error btn-sm"
      >
        <OtherVIcon icon="fa-solid fa-trash-can" />
        xóa
      </div>
    </div>
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
const props = defineProps({
  data: String,
  url: String,
  type: String,
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

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
