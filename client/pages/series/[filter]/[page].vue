<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="flex flex-wrap">
        <nuxtLink
          :to="i.url"
          v-for="i in datafilter"
          :key="i"
          class="mr-1 mb-1 btn btn-outline btn-sm lg:btn-md"
        >
          {{ i.name }}
        </nuxtLink>
      </div>
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md"
      >
        tạo series mới
      </button>
    </div>

    <div v-if="loadingSkeleton" class="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in 7" :key="i.id">
        <SeriesVSkeleton />
      </div>
    </div>
    <div v-else class="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in useSeries.List_series" :key="i.id">
        <SeriesVMono :data="i" />
      </div>
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
const useRouteS = routeStore();
const loadingSkeleton = ref(false);
const datafilter = ref([
  {
    name: "mới nhất",
    url: "/series/new/0",
  },
  {
    name: "điểm cao nhất",
    url: "/series/score/0",
  },
]);

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
        useRouteS.redirectedFrom = "/series/edit";
      }
    );
  } else {
    navigateTo("/series/edit");
  }
}

async function getApi() {
  loadingSkeleton.value = true;

  try {
    await await useSeries.findAll();
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
