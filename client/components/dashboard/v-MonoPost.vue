<template>
  <div
    class="w-full duration-500 hover:bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 rounded-2xl"
  >
    <div class="flex justify-between items-center">
      <!-- tiêu đề -->
      <div class="text-left w-full ml-5">
        {{ data.title }}
      </div>
      <!-- các nút chức năng -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 pr-5">
        <div v-if="data.pins" class="tooltip indicator" data-tip="Hủy ghim bài viết">
          <div @click="openDialogDeletePins()" class="btn btn-ghost text-error">
            <OtherVIcon class-icon="rotate-45" icon="fa-solid fa-thumbtack" />
          </div>
        </div>
        <div v-else class="tooltip" data-tip="Ghim bài viết">
          <div @click="openDialogPins()" class="btn btn-ghost text-info">
            <OtherVIcon class-icon="rotate-45" icon="fa-solid fa-thumbtack" />
          </div>
        </div>
        <nuxtLink
          :to="`/post/${data._id}`"
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
            :to="`/post/edit/${data._id}`"
            :class="[loading == 'text-primary' ? 'loading ' : '']"
            class="h-10 w-10 btn btn-sm btn-ghost text-primary"
          >
            <OtherVIcon icon="fa-solid fa-edit" />
          </nuxtLink>
        </div>

        <div
          data-tip="Xóa "
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
import { authStore } from "~/stores/auth.store";
import { alertStore } from "~~/stores/alert.store";
import { dialogStore } from "~~/stores/dialog.store";
import { postStore } from "~~/stores/post.store";
import { routeStore } from "~~/stores/route.store";

const useRouteS = routeStore();
const useAlert = alertStore();
const useAuth = authStore();
const useDialog = dialogStore();
const usePost = postStore();
const props = defineProps({
  data: Object,
});
const loading = ref("");

function openDialogDelete() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "Bạn chắc chắn muốn xóa bài viết?",
      btn1: "Ok",
      btn2: "Hủy",
    },
    async () => {
      try {
        await usePost.deleteOne(props.data._id);
        useAlert.setSuccess("Xóa thành công");
        useRouteS.refreshData();
      } catch (error) {
        console.log(error);
      }
    }
  );
}

function openDialogPins() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn chắc chắn muốn ghim bài viết này bài viết?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        const data = {
          id: props.data._id,
          pins: true,
        };
        try {
          await usePost.update(data);
          await usePost.findByAuthor(props.data.author[0]._id);
          useAlert.setSuccess("Ghim thành công");
        } catch (error) {
          console.log(error);
        }
      }
    );
  }
}

function openDialogDeletePins() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn chắc chắn muốn xóa ghim bài viết này bài viết?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        const data = {
          id: props.data._id,
          pins: false,
        };
        try {
          await usePost.update(data);
          await usePost.findByAuthor(props.data.author[0]._id);
          useAlert.setSuccess("Xóa ghim thành công");
        } catch (error) {
          console.log(error);
        }
      }
    );
  }
}
</script>
