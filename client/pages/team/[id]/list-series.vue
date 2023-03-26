<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-end">
      <button
        v-if="useMember.isMember"
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md mb-5"
      >
        tạo series
      </button>
    </div>

    <div v-if="loadingSkeleton" class="space-y-5">
      <div v-for="i in 7" :key="i.id">
        <SeriesVSkeleton />
      </div>
    </div>

    <div class="space-y-5" v-else-if="useSeries.List_series.length > 0">
      <div v-for="i in useSeries.List_series" :key="i.id">
        <SeriesVMono :is-edit-t="useMember.isEditT" :data="i" />
      </div>
    </div>

    <div v-else>
      <div class="text-4xl text-center m-5">chưa có chuỗi bài viết nào cả!!!</div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { seriesStore } from "~~/stores/series.store";
import { routeStore } from "~~/stores/route.store";
import { teamStore } from "~~/stores/team.store";
import { dialogStore } from "../../../stores/dialog.store";
import { memberStore } from "~~/stores/member.store";

const useMember = memberStore();
const route = useRoute();
const useSeries = seriesStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const useTeam = teamStore();
const loadingSkeleton = ref(false);
function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để tạo bài viết",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = `/series/team/${useTeam.team[0]._id}`;
      }
    );
  } else {
    navigateTo(`/series/team/${useTeam.team[0]._id}`);
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useSeries.findByTeam(route.params.id);
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  useRouteS.cb = getApi;
  getApi();
});
</script>

<style></style>
