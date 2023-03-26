<template>
  <div class="mt-5">
    <div v-if="loadingSkeleton" class="grid lg:grid-cols-2 grid-cols-1 gap-5">
      <div v-for="i in 7" :key="i">
        <SeriesVSkeleton />
      </div>
    </div>
    <div>
      <div
        class="grid lg:grid-cols-2 grid-cols-1 gap-5"
        v-if="usefollow.follow_series[0]"
      >
        <div v-for="i in usefollow.follow_series" :key="i.id">
          <FollowVMonoSeries :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">
          Bạn chưa lưu chuỗi bài viết nào cả !?
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { routeStore } from "~~/stores/route.store";
import { followStore } from "~~/stores/follow.store";

const loadingSkeleton = ref(false);
const useAuth = authStore();
const useRouteS = routeStore();
const usefollow = followStore();
async function getApi() {
  loadingSkeleton.value = true;
  try {
    usefollow.findByMySeries(useAuth.user.id);
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
