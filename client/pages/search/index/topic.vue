<template>
  <div class="my-5">
    <div>
      <div class="space-y-5" v-if="useSearch.list_search_topic[0]">
        <div v-for="i in useSearch.list_search_topic" :key="i.id">
          <SearchVMonoTopic :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">không tìm thấy chủ đề nào cả!?</div>
        <div class="text-center text-2xl my-10">hãy thử nhập từ khóa khác</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { routeStore } from "~~/stores/route.store";
import { searchStore } from "~~/stores/search.store";

const useRouteS = routeStore();
const useSearch = searchStore();

async function refreshData() {
  await useSearch.getTopic();
}
onMounted(() => {
  useRouteS.cb = refreshData;
});
</script>

<style></style>
