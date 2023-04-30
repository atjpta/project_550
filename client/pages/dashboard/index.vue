<template>
  <div>
    <DashboardVInfo :manager="manager" />
    <!-- chuyển chế độ -->

    <div>
      <div @click="goTo()" v-if="!manager" class="btn btn-primary btn-sm btn-outline">
        Chế độ quản lý
      </div>
      <div @click="goTo()" v-if="manager" class="btn btn-primary btn-sm btn-outline">
        Chế độ xem
      </div>
    </div>
    <!-- nút chuyển trang -->
    <div class="tabs mt-3">
      <div v-for="i in menu" :key="i">
        <nuxtLink :to="'/dashboard' + i.url" :class="'/dashboard' + i.url == route.path ? 'tab-active' : ''"
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
    title: "Tổng quan",
    url: "/read/overview",
  },
  {
    title: "Bài viết",
    url: "/read/post",
  },
  {
    title: "Chuỗi bài viết",
    url: "/read/series",
  },
  {
    title: "Câu hỏi",
    url: "/read/question",
  },
  {
    title: "Chủ đề",
    url: "/read/topic",
  },
]);

const menuDashboardManager = ref([
  {
    title: "Bài viết",
    url: "/manager/post",
  },
  {
    title: "Chuỗi bài viết",
    url: "/manager/series",
  },
  {
    title: "Câu hỏi",
    url: "/manager/question",
  },
  {
    title: "Chủ đề",
    url: "/manager/topic",
  },
  {
    title: "Nhóm",
    url: "/manager/team",
  },
  {
    title: "Thẻ tag",
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

useHead({
  title: "Trang cá nhân",
});
</script>

<style></style>
