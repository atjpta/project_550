<template>
  <div class="my-5">
    <div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        v-if="useSearch.list_search_user[0]"
      >
        <div v-for="i in useSearch.list_search_user" :key="i.id">
          <SearchVMonoUser :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">không tìm thấy người dùng nào cả!?</div>
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
  await useSearch.getUser();
}
onMounted(() => {
  useRouteS.cb = refreshData;
});
</script>

<style></style>
