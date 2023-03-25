<template>
  <div class="">
    <div>
      <TeamVTeam :data="useTeam.team[0]" />
    </div>

    <div class="mb-4 flex flex-wrap">
      <div v-for="i in menuTab" :key="i.title">
        <nuxt-link :to="i.url" class="btn btn-outline btn-sm mr-1 mb-1">{{
          i.title
        }}</nuxt-link>
      </div>
    </div>
    <div class="animate-ping border-b-2 border-blue-500 h-1 w-2/5 mx-auto mb-5"></div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { roleStore } from "~~/stores/role.store";
import { teamStore } from "~~/stores/team.store";

const route = useRoute();
const useTeam = teamStore();
const useRole = roleStore();
async function getApi() {
  await useRole.findAll();
  await useTeam.findOne(route.params.id);
  if (useTeam.team[0].role == "chief" || useTeam.team[0].role == "handler") {
    menuTab.value.push({
      title: "yêu cầu",
      url: `/team/${route.params.id}/list-request`,
    });
  }
}

const menuTab = ref([
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
]);

onMounted(() => {
  getApi();
});
</script>

<style></style>
