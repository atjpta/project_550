<template>
  <div class="my-5">
    <div>
      <div class="space-y-5" v-if="useSearch.list_search_series[0]">
        <div v-for="i in useSearch.list_search_series" :key="i.id">
          <SearchVMonoSeries :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">
          Không tìm thấy chuỗi bài viết nào cả!?
        </div>
        <div class="text-center text-2xl my-10">Hãy thử nhập từ khóa khác</div>
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
  await useSearch.getSeries();
}
onMounted(() => {
  useRouteS.cb = refreshData;
});
</script>

<style></style>
