<template>
  <div>
    <div class="bg-base-200 rounded-2xl border-b-4 border-info p-5">
      <div class="text-4xl font-bold uppercase mb-3">các thẻ tag</div>
      <div class="text-xl indent-8">
        Các bài viết, câu hỏi, sẽ được gắn các hash tag để có thể tìm thấy 1 cách nhanh
        chóng
      </div>
    </div>
    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="i in useTag.List_tag" :key="i._id">
        <TagVMono :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { tagStore } from "~~/stores/tag.store";

const useTag = tagStore();
const route = useRoute();
async function getApi() {
  await useTag.findAllInfo();
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
