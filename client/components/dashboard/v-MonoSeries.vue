<template>
  <div
    class="w-full duration-500 hover:bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-pink-500/10 p-3 rounded-2xl"
  >
    <div class="flex justify-between items-center">
      <!-- tiêu đề -->
      <div class="text-left w-full ml-5">
        {{ data.name }}
      </div>

      <!-- các nút chức năng -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 pr-5">
        <nuxtLink
          :to="`/series/${data._id}`"
          data-tip="Xem chi tiết"
          class="h-10 w-10 flex tooltip tooltip-left lg:tooltip-top btn btn-sm btn-ghost text-info"
        >
          <OtherVIcon icon="fa-solid fa-eye" />
        </nuxtLink>

        <div
          data-tip="Sửa"
          class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top"
        >
          <nuxtLink
            :to="`/series/edit/${data._id}`"
            :class="[loading == 'text-primary' ? 'loading ' : '']"
            class="h-10 w-10 btn btn-sm btn-ghost text-primary"
          >
            <OtherVIcon icon="fa-solid fa-edit" />
          </nuxtLink>
        </div>

        <div
          data-tip="Xóa"
          class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top"
        >
          <div
            :class="[loading ? 'deleteModel ' : '']"
            @click="openDialogDelete()"
            class="h-10 w-10 btn btn-sm btn-ghost text-error"
          >
            <OtherVIcon icon="fa-solid fa-trash" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { seriesStore } from "~/stores/series.store";
import { alertStore } from "~~/stores/alert.store";
import { dialogStore } from "~~/stores/dialog.store";
import { routeStore } from "~~/stores/route.store";

const useRouteS = routeStore();
const useAlert = alertStore();
const useDialog = dialogStore();
const useSeries = seriesStore();
const props = defineProps({
  data: Object,
});
const loading = ref("");
function openDialogDelete() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "bạn chắc chắn muốn xóa chuỗi bài viết?",
      btn1: "Ok",
      btn2: "Hủy",
    },
    async () => {
      try {
        await useSeries.deleteOne(props.data._id);
        useRouteS.refreshData();
        useAlert.setSuccess("Xóa thành công");
      } catch (error) {
        console.log(error);
      }
    }
  );
}
</script>
