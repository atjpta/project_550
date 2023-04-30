<template>
  <div
    class="w-full duration-500 hover:bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 rounded-2xl">
    <div class="flex justify-between items-center">
      <!-- tiêu đề -->
      <div class="text-left w-full ml-5">
        {{ data.name }}
      </div>

      <!-- các nút chức năng -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 pr-5">
        <div data-tip="Xem chi tiết" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <div @click="navigateTo(`/course/${data.id}/review`)" class="h-10 w-10 btn btn-sm btn-ghost text-info">
            <OtherVIcon icon="fa-solid fa-eye" />
          </div>
        </div>
        <div data-tip="Chỉnh kiểu môn học" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <nuxtLink :to="`/admin/course/edit/${data.id}`" class="h-10 w-10 btn btn-sm btn-ghost text-primary">
            <OtherVIcon icon="fa-solid fa-edit" />
          </nuxtLink>
        </div>
        <div data-tip="Xóa kiểu môn học" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <div @click="openDialogDelete()" class="h-10 w-10 btn btn-sm btn-ghost text-error">
            <OtherVIcon icon="fa-solid fa-trash" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { alertStore } from "~/stores/alert.store";
import { courseStore } from "~/stores/course.store";
import { routeStore } from "~/stores/route.store";
import { dialogStore } from "~~/stores/dialog.store";

const props = defineProps({
  data: Object,
});
const useDialog = dialogStore();
const useRouteS = routeStore();
const useCourse = courseStore();
const useAlert = alertStore();

function openDialogDelete() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "Bạn chắc chắn muốn xóa loại môn học này này",
      btn1: "Ok",
      btn2: "Hủy",
    },
    async () => {
      try {
        await useCourse.deleteOne(props.data.id);
        useRouteS.refreshData(1);
        useAlert.setSuccess("Xóa thành công");
      } catch (error) {
        console.log(error);
      }
    }
  );
}
</script>
