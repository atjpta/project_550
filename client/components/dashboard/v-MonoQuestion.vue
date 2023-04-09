<template>
  <div
    class="w-full duration-500 hover:bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-pink-500/0 p-3 rounded-2xl">
    <div class="flex justify-between items-center">
      <!-- tiêu đề -->
      <div class="text-left w-full ml-5">
        {{ data.title }}
      </div>

      <!-- các nút chức năng -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 pr-5">
        <nuxtLink :to="`/question/${data._id}`" data-tip="xem chi tiết"
          class="h-10 w-10 flex tooltip tooltip-left lg:tooltip-top btn btn-sm btn-ghost text-info">
          <OtherVIcon icon="fa-solid fa-eye" />
        </nuxtLink>

        <div data-tip="sửa" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <nuxtLink :to="`/question/edit/${data._id}`" :class="[loading == 'text-primary' ? 'loading ' : '']"
            class="h-10 w-10 btn btn-sm btn-ghost text-primary">
            <OtherVIcon icon="fa-solid fa-edit" />
          </nuxtLink>
        </div>

        <div data-tip="xóa câu hỏi" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
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
import { alertStore } from "~~/stores/alert.store";
import { dialogStore } from "~~/stores/dialog.store";
import { questionStore } from "~~/stores/question.store";
import { routeStore } from "~~/stores/route.store";

const useRouteS = routeStore();
const useAlert = alertStore();
const useDialog = dialogStore();
const useQuestion = questionStore();
const props = defineProps({
  data: Object,
});
const loading = ref("");
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
        await useQuestion.deleteOne(props.data._id);
        useRouteS.refreshData();
        useAlert.setSuccess("xóa thành công");
      } catch (error) {
        console.log(error);
      }
    }
  );
}
</script>
