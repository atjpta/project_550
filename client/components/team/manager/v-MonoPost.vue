<template>
  <div
    class="w-full duration-500 hover:bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 rounded-2xl">
    <div class="flex justify-between items-center">
      <!-- tác giả -->
      <div class="basis-1/3">
        <nuxt-link :to="`/user/${data.author[0]._id}/overview`" class="flex items-center space-x-3 hover:text-info">
          <div class="avatar">
            <div class="mask mask-squircle w-12 h-12">
              <img :src="data.author[0].avatar_url" />
            </div>
          </div>
          <div>
            <div class="font-bold">{{ data.author[0].name }}</div>
          </div>
        </nuxt-link>
      </div>
      <!-- tiêu đề -->
      <div class="text-left w-full ml-5">
        {{ data.title }}
      </div>

      <!-- các nút chức năng -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 pr-5">
        <div data-tip="xóa bài viết khỏi nhóm" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <div :class="[loading ? 'deleteModel ' : '']" @click="openDialogRemoveTeam()"
            class="h-10 w-10 btn btn-sm btn-ghost text-warning">
            <OtherVIcon icon="fa-solid fa-xmark" />
          </div>
        </div>

        <nuxtLink :to="`/post/${data._id}`" data-tip="xem chi tiết"
          class="h-10 w-10 flex tooltip tooltip-left lg:tooltip-top btn btn-sm btn-ghost text-info">
          <OtherVIcon icon="fa-solid fa-eye" />
        </nuxtLink>

        <div v-if="isAuthor" data-tip="sửa" class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top">
          <nuxtLink :to="`/post/edit/${data._id}`" :class="[loading == 'text-primary' ? 'loading ' : '']"
            class="h-10 w-10 btn btn-sm btn-ghost text-primary">
            <OtherVIcon icon="fa-solid fa-edit" />
          </nuxtLink>
        </div>

        <div v-if="isAuthor" data-tip="xóa bài viết"
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
        await usePost.deleteOne(props.data._id);
        useAlert.setSuccess("xóa thành công");
        useRouteS.refreshData();
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
