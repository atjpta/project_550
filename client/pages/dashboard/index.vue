<template>
  <div>
    <DashboardVInfo :manager="manager" />
    <!-- chuyển chế độ -->

    <div>
      <div @click="goTo()" v-if="!manager" class="btn btn-primary btn-sm btn-outline">
        chế độ quản lý
      </div>
      <div @click="goTo()" v-if="manager" class="btn btn-primary btn-sm btn-outline">
        chế độ xem
      </div>
    </div>
    <!-- nút chuyển trang -->
    <div class="flex flex-wrap mt-3">
      <div v-for="i in menu" :key="i">
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
    title: "tổng quan",
    url: "/read/overview",
  },
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
    title: "nhóm",
    url: "/manager/team",
  },
  {
    title: "thẻ tag",
    url: "/manager/tag",
  },
]);

function goTo() {
  if (manager.value) {
    manager.value = false;
    return navigateTo("/dashboard/read/overview");
  } else {
    manager.value = true;
    return navigateTo("/dashboard/manager/post");
  }
}

async function getApi() {
  // await useUser.findOne(useAuth.user.id);
}

const route = useRoute();

onMounted(() => {
  getApi();
  if (route.fullPath == "/dashboard" || route.fullPath == "/dashboard/read") {
    navigateTo("/dashboard/read/overview");
  }
  const typePage = route.fullPath.split("/")[2];

  if (typePage == "read") {
    manager.value = false;
  } else if (typePage == "manager") {
    manager.value = true;
  }
});

definePageMeta({
  middleware: "guest",
});
</script>

<style></style>
