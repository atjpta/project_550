<template>
  <div class="">
    <UserVInfo />
    <div class="tabs mt-3">
      <div v-for="i in menuDashboard" :key="i">
        <nuxtLink :to="`/user/${route.params.id}` + i.url"
          :class="`/user/${route.params.id}` + i.url == route.path ? 'tab-active' : ''"
          class="tab tab-bordered uppercase font-medium">
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
    title: "Tổng quan",
    url: "/overview",
  },
  {
    title: "Bài viết",
    url: "/post",
  },
  {
    title: "Chuỗi bài viết",
    url: "/series",
  },
  {
    title: "Câu hỏi",
    url: "/question",
  },
  {
    title: "Chủ đề",
    url: "/topic",
  },
]);

async function getApi() {
  await useUser.findOverView(route.params.id);
}

onMounted(() => {
  getApi();
});

onUnmounted(() => {
  useUser.overview = {};
});

const title = computed(() => {
  return useUser.overview.name;
});

useHead({
  title: title,
});
</script>

<style></style>
