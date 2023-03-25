<template>
  <div>
    <!-- các nut lọc -->
    <div class="flex justify-end">
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md mb-5"
      >
        tạo Nhóm mới
      </button>
    </div>
    <div>
      <div v-for="i in useMember.List_myteam" :key="i.id">
        <TeamVMonoD :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { teamStore } from "~~/stores/team.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "~~/stores/dialog.store";
import { roleStore } from "~~/stores/role.store";
import { memberStore } from "~~/stores/member.store";

const useTeam = teamStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRoute = routeStore();
const useRole = roleStore();
const useMember = memberStore();
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
        useRoute.redirectedFrom = "/team/edit";
      }
    );
  } else {
    navigateTo("/team/edit");
  }
}

async function getApi() {
  await useRole.findAll();
  await useMember.findTeamByUser(useAuth.user.id);
}
onMounted(() => {
  getApi();
});
</script>

<style></style>
