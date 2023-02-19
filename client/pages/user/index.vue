<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="space-x-1">
        <div v-for="i in 3" :key="i" class="btn btn-primary btn-outline btn-sm lg:btn-md">
          lọc
        </div>
      </div>
    </div>

    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="i in useUser.list_user" :key="i">
        <UserVMono :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";

const useUser = userStore();
async function getApi() {
  await useUser.findAllOverView();
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
