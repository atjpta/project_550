<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="space-x-1">
        <div v-for="i in 3" :key="i" class="btn btn-primary btn-outline btn-sm lg:btn-md">
          {{ i }} 0000
        </div>
      </div>
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md"
      >
        tạo series mới
      </button>
    </div>
    <div v-if="useSeries.List_series.length > 0">
      <div v-for="i in useSeries.List_series" :key="i.id">
        <SeriesVMonoD :data="i" />
      </div>
    </div>

    <div v-else>
      <div class="text-4xl text-center m-5">chưa có chuỗi bài viết nào cả!!!</div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { routeStore } from "~~/stores/route.store";
import { seriesStore } from "~~/stores/series.store";
import { dialogStore } from "~~/stores/dialog.store";

const useSeries = seriesStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRoute = routeStore();
function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để tạo nhóm mới",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRoute.redirectedFrom = "/series/edit";
      }
    );
  } else {
    navigateTo("/series/edit");
  }
}
onMounted(() => {
  useSeries.findByAuthor(useAuth.user.id);
});
</script>

<style></style>
