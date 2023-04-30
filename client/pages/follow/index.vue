<template>
  <div>
    <span
      class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block"
    >
      <span class="relative text-white text-3xl font-black px-5">Theo dõi</span>
    </span>

    <div class="tabs mt-3">
      <div v-for="i in menuDashboard" :key="i">
        <nuxtLink
          :to="'/follow' + i.url"
          :class="'/follow' + i.url == route.path ? 'tab-active' : ''"
          class="tab tab-bordered uppercase font-medium"
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
    title: "Môn học",
    url: "/course",
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
  {
    title: "Người dùng",
    url: "/user",
  },
  {
    title: "Nhóm",
    url: "/team",
  },
  {
    title: "Thẻ tag",
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
  title: "Theo dõi",
});
</script>

<style></style>
