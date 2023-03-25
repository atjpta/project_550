<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-end">
      <button
        v-if="useMember.isMember"
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md mb-5"
      >
        tạo topic
      </button>
    </div>
    <div class="space-y-5" v-if="useTopic.List_topic.length > 0">
      <div v-for="i in useTopic.List_topic" :key="i.id">
        <TopicVMono :data="i" />
      </div>
    </div>

    <div v-else>
      <div class="text-4xl text-center m-5">chưa có chủ đề nào cả!!!</div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { topicStore } from "~~/stores/topic.store";
import { routeStore } from "~~/stores/route.store";
import { teamStore } from "~~/stores/team.store";
import { dialogStore } from "../../../stores/dialog.store";
import { memberStore } from "~~/stores/member.store";

const useMember = memberStore();
const route = useRoute();
const useTopic = topicStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const useTeam = teamStore();
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
        useRouteS.redirectedFrom = `/topic/team/${useTeam.team[0]._id}`;
      }
    );
  } else {
    navigateTo(`/topic/team/${useTeam.team[0]._id}`);
  }
}

async function getApi() {
  await useTopic.findByTeam(route.params.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
