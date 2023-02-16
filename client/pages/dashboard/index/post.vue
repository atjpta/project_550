<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="space-x-1">
        <div v-for="i in 3" :key="i" class="btn btn-primary btn-outline btn-sm lg:btn-md">
          {{ i }} 0000
        </div>
      </div>
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md"
      >
        tạo bài viết
      </button>
    </div>
    <div
      v-if="listPost.listPins.length > 0"
      class="border-2 shadow-md border-info mt-5 rounded-2xl indicator w-full"
    >
      <div class="indicator-item indicator-end mr-10">
        <OtherVIcon
          class-icon="rotate-45 text-3xl text-primary"
          icon="fa-solid fa-thumbtack"
        />
      </div>
      <div class="w-full mx-5">
        <div v-for="i in listPost.listPins" :key="i.id">
          <PostVMonoD :data="i" />
        </div>
      </div>
    </div>
    <div>
      <div v-for="i in listPost.listNoPins" :key="i.id">
        <PostVMonoD :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { postStore } from "~~/stores/post.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "~~/stores/dialog.store";

const usePost = postStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRoute = routeStore();

const listPost = computed(() => {
  let listPins = [];
  let listNoPins = [];
  usePost.list.forEach((e) => {
    if (e.pins) {
      listPins.push(e);
    } else listNoPins.push(e);
  });
  return {
    listPins,
    listNoPins,
  };
});
function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để tạo bài viết",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRoute.redirectedFrom = "/post/edit";
      }
    );
  } else {
    navigateTo("/post/edit");
  }
}
onMounted(() => {
  usePost.findByAuthor(useAuth.user.id);
});
</script>

<style></style>
