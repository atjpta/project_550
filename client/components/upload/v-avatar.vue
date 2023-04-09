<template>
  <div class="z-0">
    <div class="w-64">
      <div @mouseenter="openIcon = true" class="w-64 relative">
        <img class="bg-black/50 h-64 w-64 rounded-full" :src="useImage.previewImage || useUser.user.avatar_url" alt="" />
        <div v-if="openIcon && manager" @mouseleave="openIcon = false"
          class="h-full w-full btn btn-ghost rounded-full text-5xl text-base-300 absolute top-0">
          <!-- <OtherVIcon icon="fa-solid fa-camera" /> -->
          <input @change="useImage.previewFiles($event)" accept="image/*" type="file"
            class="file-input file-input-bordered file-input-primary w-full max-w-xs" />
        </div>
      </div>
      <!-- các btn -->
      <div v-if="useImage.previewImage" class="flex justify-around m-5">
        <div @click="updata()" :class="[loading ? 'loading' : '']" class="btn text-primary btn-ghost">
          <OtherVIcon icon="fa-solid fa-floppy-disk" />
        </div>
        <div @click="cancel()" class="btn text-error btn-ghost">
          <OtherVIcon icon="fa-solid fa-trash-can" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { userStore } from "~~/stores/user.store";

const props = defineProps({
  manager: Boolean,
});
const loading = ref(false);
const useImage = imageStore();
const openIcon = ref(false);
const useUser = userStore();

async function updata() {
  loading.value = true;
  try {
    const url = await useImage.uploadImage();
    const data = {
      id: useUser.user.id,
      avatar_url: url,
    };
    await useUser.update(data);
    await useUser.findOne(useUser.user.id);
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
