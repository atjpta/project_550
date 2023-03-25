<template>
  <div class="mt-5">
    <div v-if="usefollow.follow_user[0]">
      <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="i in usefollow.follow_user" :key="i">
          <FollowVMonoUser :data="i" />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="text-center text-2xl my-10">Bạn chưa theo dõi người dùng nào cả !?</div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { routeStore } from "~~/stores/route.store";
import { followStore } from "~~/stores/follow.store";

const useAuth = authStore();
const useRouteS = routeStore();
const usefollow = followStore();
async function getApi() {
  usefollow.findByMyUser(useAuth.user.id);
}
onMounted(() => {
  useRouteS.cb = getApi;
  getApi();
});
</script>

<style></style>
