<template>
  <div class="mt-5">
    <div v-if="loadingSkeleton" class="space-y-5">
      <div v-for="i in 7" :key="i">
        <PostVSkeleton />
      </div>
    </div>
    <div v-else>
      <div class="space-y-5" v-if="usefollow.follow_post[0]">
        <div v-for="i in usefollow.follow_post" :key="i.id">
          <FollowVMonoPost :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">Bạn chưa lưu bài viết nào cả !?</div>
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
    usefollow.findByMyPost(useAuth.user.id);
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
