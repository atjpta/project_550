<template>
  <div class="pb-5">
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
    <NuxtPage v-if="useTeam.team[0]?.status[0].name == 'public' || useMember.isMember" />
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { memberStore } from "~~/stores/member.store";
import { roleStore } from "~~/stores/role.store";
import { teamStore } from "~~/stores/team.store";

const route = useRoute();
const useTeam = teamStore();
const useRole = roleStore();
const useMember = memberStore();
const useAuth = authStore();
const menuTab = ref([
  {
    title: "bài viết",
    url: `/team/${route.params.id}/list-post`,
  },
  {
    title: "chuỗi bài viết",
    url: `/team/${route.params.id}/list-series`,
  },
  {
    title: "Câu hỏi",
    url: `/team/${route.params.id}/list-question`,
  },
  {
    title: "chủ đề",
    url: `/team/${route.params.id}/list-topic`,
  },
  {
    title: "thành viên",
    url: `/team/${route.params.id}/list-member`,
  },
]);

async function getApi() {
  await useRole.findAll();
  await useTeam.findOne(route.params.id);
  if (useAuth.user) {
    await useMember.checkIsMember(route.params.id, useAuth.user.id);
    if (useTeam?.team[0].role == "chief" || useTeam?.team[0].role == "handler") {
      useMember.isEditT = true;
      menuTab.value.push({
        title: "yêu cầu",
        url: `/team/${route.params.id}/list-request`,
      });
    }
  }
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
