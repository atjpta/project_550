<template>
  <div class="my-5">
    <div>
      <div class="flex flex-wrap" v-if="useSearch.list_search_course[0]">
        <div v-for="i in useSearch.list_search_course" :key="i.id">
          <CourseVMono class="mr-3 mb-3" :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">Không tìm thấy môn học nào cả!?</div>
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
</script>

<style></style>
