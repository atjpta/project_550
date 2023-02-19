<template>
  <div>
    <UserVInfo />
    <div class="flex flex-wrap mt-3">
      <div v-for="i in menuDashboard" :key="i">
        <nuxtLink
          :to="`/user/${route.params.id}` + i.url"
          class="btn btn-sm btn-outline mr-1 mb-1"
        >
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
const route = useRoute();
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
]);

async function getApi() {
  await useUser.findOverView(route.params.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
