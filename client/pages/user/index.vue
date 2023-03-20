<template>
  <div class="">
    <div
      v-if="loadingSkeleton"
      class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5"
    >
      <div v-for="i in 7" :key="i">
        <UserVSkeleton />
      </div>
    </div>
    <div v-else class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in useUser.list_user" :key="i">
        <UserVMono :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";

const loadingSkeleton = ref(false);
const useUser = userStore();
async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useUser.findAllOverView();
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
