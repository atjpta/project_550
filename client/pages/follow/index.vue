<template>
  <div>
    <div class="text-3xl font-bold uppercase mb-5">đã lưu</div>
    <div class="flex flex-wrap mt-3">
      <div v-for="i in menuDashboard" :key="i">
        <nuxtLink :to="'/follow' + i.url" class="btn btn-sm btn-outline mr-1 mb-1">
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
    title: "người dùng",
    url: "/user",
  },
  {
    title: "nhóm",
    url: "/team",
  },
  {
    title: "thẻ tag",
    url: "/tag",
  },
]);

async function getApi() {
  // await useUser.findOne(useAuth.user.id);
}

onMounted(() => {
  if (route.path == "/follow") {
    navigateTo("/follow/post");
  }
  getApi();
});
</script>

<style></style>
