<template>
  <div
    class="w-full duration-500 hover:bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-pink-500/10 p-3 rounded-2xl">
    <div class="flex justify-between items-center">
      <!-- tiêu đề -->
      <div class="text-left w-full ml-5">
        {{ data.team.name }}
      </div>

      <!-- các nút chức năng -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 pr-5">
        <nuxtLink :to="`/team/${data.team._id}/list-post`" data-tip="xem chi tiết"
          class="h-10 w-10 flex tooltip tooltip-left lg:tooltip-top btn btn-sm btn-ghost text-info">
          <OtherVIcon icon="fa-solid fa-eye" />
        </nuxtLink>

        <div v-if="data.role.name == 'chief'" data-tip="sửa"
          class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <nuxtLink :to="`/team/edit/${data.team._id}`" :class="[loading == 'text-primary' ? 'loading ' : '']"
            class="h-10 w-10 btn btn-sm btn-ghost text-primary">
            <OtherVIcon icon="fa-solid fa-edit" />
          </nuxtLink>
        </div>
        <div v-else data-tip="thoát nhóm" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <div @click="openDialogOutTeam()" :class="[loading == 'text-warning' ? 'loading ' : '']"
            class="h-10 w-10 btn btn-sm btn-ghost text-warning">
            <OtherVIcon icon="fa-solid fa-right-from-bracket" />
          </div>
        </div>

        <div v-if="data.role.name == 'chief'" data-tip="xóa nhóm"
          class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <div :class="[loading ? 'deleteModel ' : '']" @click="openDialogDelete()"
            class="h-10 w-10 btn btn-sm btn-ghost text-error">
            <OtherVIcon icon="fa-solid fa-trash" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { memberStore } from "~/stores/member.store";
import { teamStore } from "~/stores/team.store";
import { alertStore } from "~~/stores/alert.store";
import { dialogStore } from "~~/stores/dialog.store";
import { routeStore } from "~~/stores/route.store";

const useRouteS = routeStore();
const useAlert = alertStore();
const useDialog = dialogStore();
const useMember = memberStore();
const useTeam = teamStore();
const props = defineProps({
  data: Object,
});
const loading = ref("");
function openDialogDelete() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "bạn chắc chắn muốn xóa nhóm?",
      btn1: "ok",
      btn2: "hủy",
    },
    async () => {
      try {
        await useMember.deleteAllByTeam(props.data.team._id);
        await useTeam.deleteOne(props.data.team._id);
        useRouteS.refreshData();
        useAlert.setSuccess("xóa thành công");
      } catch (error) {
        console.log(error);
      }
    }
  );
}

function openDialogOutTeam() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "bạn chắc chắn muốn thoát khỏi nhóm?",
      btn1: "ok",
      btn2: "hủy",
    },
    async () => {
      try {
        loading.value = true;
        await useMember.deleteOne(props.data.id);
        useRouteS.refreshData();
        useAlert.setSuccess("thoát nhóm thành công");
      } catch (error) {
        console.log(error);
        console.log("lỗi xóa ");
      } finally {
        loading.value = false;
      }
    }
  );
}
</script>
