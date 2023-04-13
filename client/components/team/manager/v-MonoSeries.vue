<template>
  <div
    class="w-full duration-500 hover:bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-pink-500/10 p-3 rounded-2xl">
    <div class="flex justify-between items-center">
      <!-- tiêu đề -->
      <div class="text-left w-full ml-5">
        {{ data.name }}
      </div>

      <!-- các nút chức năng -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 pr-5">
        <div data-tip="xóa bài viết khỏi nhóm" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <div :class="[loading ? 'deleteModel ' : '']" @click="openDialogRemoveTeam()"
            class="h-10 w-10 btn btn-sm btn-ghost text-warning">
            <OtherVIcon icon="fa-solid fa-xmark" />
          </div>
        </div>
        <nuxtLink :to="`/series/${data._id}`" data-tip="xem chi tiết"
          class="h-10 w-10 flex tooltip tooltip-left lg:tooltip-top btn btn-sm btn-ghost text-info">
          <OtherVIcon icon="fa-solid fa-eye" />
        </nuxtLink>

        <div v-if="isAuthor" data-tip="sửa" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <nuxtLink :to="`/series/edit/${data._id}`" :class="[loading == 'text-primary' ? 'loading ' : '']"
            class="h-10 w-10 btn btn-sm btn-ghost text-primary">
            <OtherVIcon icon="fa-solid fa-edit" />
          </nuxtLink>
        </div>

        <div v-if="isAuthor" data-tip="xóa câu hỏi"
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
import { authStore } from "~/stores/auth.store";
import { seriesStore } from "~/stores/series.store";
import { alertStore } from "~~/stores/alert.store";
import { dialogStore } from "~~/stores/dialog.store";
import { routeStore } from "~~/stores/route.store";

const useRouteS = routeStore();
const useAuth = authStore();
const useAlert = alertStore();
const useDialog = dialogStore();
const useSeries = seriesStore();
const props = defineProps({
  data: Object,
});
const loading = ref("");

const isAuthor = computed(() => {
  if (useAuth.user && props.data.author) {
    return useAuth.user.id == props.data.author[0]._id;
  }
});

function openDialogDelete() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "bạn chắc chắn muốn xóa bài viết?",
      btn1: "ok",
      btn2: "hủy",
    },
    async () => {
      try {
        await useSeries.deleteOne(props.data._id);
        useRouteS.refreshData();
        useAlert.setSuccess("xóa thành công");
      } catch (error) {
        console.log(error);
      }
    }
  );
}

function openDialogRemoveTeam() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn xóa bài viết ra khỏi nhóm?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        try {
          await usePost.update({
            id: props.data._id,
            team: " ",
          });
          useAlert.setSuccess("xóa thành công");
          await useRouteS.refreshData();
        } catch (error) {
          console.log(error);
        }
      }
    );
  }
}
</script>
