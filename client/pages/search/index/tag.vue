<template>
  <div class="my-5">
    <div>
      <div
        class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        v-if="useSearch.list_search_tag[0]"
      >
        <div v-for="i in useSearch.list_search_tag" :key="i.id">
          <SearchVMonoTag :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">không tìm thấy thẻ tag nào cả!?</div>
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
  await useSearch.getTag();
}
onMounted(() => {
  useRouteS.cb = refreshData;
});
</script>

<style></style>
