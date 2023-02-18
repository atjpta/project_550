<template>
  <div>
    <div><TagVTag /></div>
    <div>
      <div class="flex flex-wrap mt-3">
        <div v-for="i in menuDashboard" :key="i">
          <nuxtLink :to="i.url" class="btn btn-sm btn-outline mr-1 mb-1">
            <div>
              {{ i.title }}
            </div>
          </nuxtLink>
        </div>
      </div>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { tagStore } from "~~/stores/tag.store";

const route = useRoute();
const useTag = tagStore();
const menuDashboard = ref([
  {
    title: "bài viết",
    url: `/tag/${route.params.id}/post`,
  },
  {
    title: "series",
    url: `/tag/${route.params.id}/series`,
  },
  {
    title: "câu hỏi",
    url: `/tag/${route.params.id}/question`,
  },
  {
    title: "Topic",
    url: `/tag/${route.params.id}/topic`,
  },
  {
    title: "nhóm",
    url: `/tag/${route.params.id}/team`,
  },
]);

async function getApi() {
  await useTag.findOne(route.params.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
