<template>
  <div class="mt-5">
    <div
      v-if="loadingSkeleton"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <div v-for="i in 7" :key="i">
        <UserVSkeleton />
      </div>
    </div>
    <div v-else>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        v-if="usefollow.follow_user[0]"
      >
        <div v-for="i in usefollow.follow_user" :key="i.id">
          <FollowVMonoUser :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">
          Bạn chưa theo dõi người dùng nào cả !?
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
    usefollow.findByMyUser(useAuth.user.id);
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
