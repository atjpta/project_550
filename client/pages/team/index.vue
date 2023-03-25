<template>
  <div>
    <!-- các nut lọc -->
    <div class="flex justify-end">
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md"
      >
        tạo Nhóm mới
      </button>
    </div>
    <div v-if="loadingSkeleton" class="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in 7" :key="i">
        <TeamVSkeleton />
      </div>
    </div>
    <div v-else class="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in useTeam.List_team" :key="i.id">
        <TeamVMono :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { teamStore } from "~~/stores/team.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { roleStore } from "~~/stores/role.store";

const loadingSkeleton = ref(false);
const useTeam = teamStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
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

const getApi = async () => {
  loadingSkeleton.value = true;
  try {
    await useRole.findAll();
    await useTeam.findAll();
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  useRouteS.cb = getApi;
  getApi();
});
</script>

<style></style>
