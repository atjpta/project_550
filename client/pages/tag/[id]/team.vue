<template>
  <div class="my-5">
    <!-- các nut lọc -->

    <div class="space-y-5" v-if="useTeam.List_team.length > 0">
      <div v-for="i in useTeam.List_team" :key="i.id">
        <TeamVMono :data="i" />
      </div>
    </div>

    <div v-else>
      <div class="text-4xl text-center m-5">
        chưa nhóm có tag #{{ useTag.tag.name }} nào cả!!!
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
import { tagStore } from "~~/stores/tag.store";

const useTeam = teamStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const route = useRoute();
const useTag = tagStore();
const useRole = roleStore();
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
        useRouteS.redirectedFrom = "/team/edit";
      }
    );
  } else {
    navigateTo("/team/edit");
  }
}

async function getApi() {
  await useRole.findAll();
  await useTeam.findByTag(route.params.id);
}
onMounted(() => {
  useRouteS.cb = getApi;
});
</script>

<style></style>
