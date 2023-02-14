<template>
  <div>
    <DashboardVInfo />
    <div class="flex flex-wrap mt-3">
      <div v-for="i in menuDashboard" :key="i">
        <nuxtLink :to="'/dashboard' + i.url" class="btn btn-sm btn-outline mr-1 mb-1">
          <div>
            {{ i.title }}
          </div>
        </nuxtLink>
      </div>
    </div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { userStore } from "~~/stores/user.store";

const useUser = userStore();
const useAuth = authStore();

const menuDashboard = ref([
  {
    title: "tổng quan",
    url: "/overview",
  },
  {
    title: "bài viết",
    url: "/post",
  },
  {
    title: "series",
    url: "/series",
  },
  {
    title: "câu hỏi",
    url: "/question",
  },
  {
    title: "Topic",
    url: "/topic",
  },
  {
    title: "nhóm",
    url: "/team",
  },
  {
    title: "Theo dõi",
    url: "/follow",
  },
]);

async function getApi() {
  // await useUser.findOne(useAuth.user.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
