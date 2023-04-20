<template>
  <div>
    <span
      class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
      <span class="relative text-white text-3xl font-black px-5">Theo dõi</span>
    </span>

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
    title: "môn học",
    url: "/course",
  },
  {
    title: "bài viết",
    url: "/post",
  },
  {
    title: "chuỗi bài viết",
    url: "/series",
  },
  {
    title: "câu hỏi",
    url: "/question",
  },
  {
    title: "chủ đề",
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
    navigateTo("/follow/course");
  }
  getApi();
});

useHead({
  title: "theo dõi",
});
</script>

<style></style>
