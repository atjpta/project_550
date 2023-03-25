<template>
  <div class="mt-5">
    <div class="space-y-5" v-if="usefollow.follow_topic[0]">
      <div v-for="i in usefollow.follow_topic" :key="i.id">
        <FollowVMonoTopic :data="i" />
      </div>
    </div>
    <div v-else>
      <div class="text-center text-2xl my-10">Bạn chưa lưu chủ đề nào cả !?</div>
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
  usefollow.findByMyTopic(useAuth.user.id);
}
onMounted(() => {
  useRouteS.cb = getApi;
  getApi();
});
</script>

<style></style>
