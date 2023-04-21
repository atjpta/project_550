<template>
  <div class="pb-5">
    <div>
      <TeamVTeam :data="useTeam.team[0]" />
    </div>
    <!-- chuyển chế độ -->
    <div v-if="useMember.isEditT" class="my-1">
      <div @click="goTo()" v-if="!manager" class="btn btn-primary btn-sm btn-outline">
        chế độ quản lý
      </div>
      <div @click="goTo()" v-if="manager" class="btn btn-primary btn-sm btn-outline">
        chế độ xem
      </div>
    </div>
    <div class="mb-4 flex flex-wrap">
      <div v-for="i in menu" :key="i.title">
        <nuxt-link :to="`/team/${route.params.id}${i.url}`" class="btn btn-outline btn-sm mr-1 mb-1">{{ i.title
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
const manager = ref(false);

const menu = computed(() => {
  if (manager.value) {
    return menuDashboardManager.value;
  } else {
    return menuDashboard.value;
  }
});

const menuDashboard = ref([
  {
    title: "bài viết",
    url: "/read/post",
  },
  {
    title: "chuỗi bài viết",
    url: "/read/series",
  },
  {
    title: "câu hỏi",
    url: "/read/question",
  },
  {
    title: "chủ đề",
    url: "/read/topic",
  },
  {
    title: "thành viên",
    url: "/read/member",
  },
]);

const menuDashboardManager = ref([
  {
    title: "bài viết",
    url: "/manager/post",
  },
  {
    title: "chuỗi bài viết",
    url: "/manager/series",
  },
  {
    title: "câu hỏi",
    url: "/manager/question",
  },
  {
    title: "chủ đề",
    url: "/manager/topic",
  },
  {
    title: "thành viên",
    url: "/manager/member",
  },
  {
    title: "Yêu cầu",
    url: "/manager/request",
  },
]);

function goTo() {
  if (manager.value) {
    manager.value = false;
    return navigateTo(`/team/${route.params.id}/read/post`);
  } else {
    manager.value = true;
    return navigateTo(`/team/${route.params.id}/manager/post`);
  }
}

async function getApi() {
  await useRole.findAll();
  await useTeam.findOne(route.params.id);
  if (useAuth.user) {
    await useMember.checkIsMember(route.params.id, useAuth.user.id);
    if (useTeam?.team[0].role == "chief" || useTeam?.team[0].role == "handler") {
      useMember.isEditT = true;
    } else {
      useMember.isEditT = false;
    }
  }
}

onMounted(() => {
  getApi();
  const typePage = route.fullPath.split("/")[3];
  // console.log(route.fullPath.split("/")[3]);
  if (typePage == "read") {
    manager.value = false;
  } else if (typePage == "manager") {
    manager.value = true;
  }
});

const title = computed(() => {
  return useTeam.team[0]?.name;
});

useHead({
  title: title,
});
</script>

<style></style>
