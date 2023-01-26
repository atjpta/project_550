<template>
  <div>
    <div>
      <TeamVMono :data="useTeam.team" />
    </div>
    <div class="mb-4 flex flex-wrap">
      <div v-for="i in menuTab" :key="i.title">
        <nuxt-link :to="i.url" class="btn btn-outline btn-sm lg:btn-md mr-1 mb-1">{{
          i.title
        }}</nuxt-link>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { teamStore } from "~~/stores/team.store";

const route = useRoute();
const useTeam = teamStore();
async function getApi() {
  await useTeam.findOne(route.params.id);
}
const menuTab = computed(() => {
  const list = [
    {
      title: "bài viết",
      url: `/team/${route.params.id}/list-post`,
    },
    {
      title: "series",
      url: `/team/${route.params.id}/list-series`,
    },
    {
      title: "Câu hỏi",
      url: `/team/${route.params.id}/list-question`,
    },
    {
      title: "Topic",
      url: `/team/${route.params.id}/list-topic`,
    },
    {
      title: "thành viên",
      url: `/team/${route.params.id}/list-member`,
    },
  ];
  return list;
});

onMounted(() => {
  getApi();
});
</script>

<style></style>
