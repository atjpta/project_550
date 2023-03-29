<template>
  <div class="">
    <div v-if="loadingSkeleton" class="space-y-5 mt-5">
      <div v-for="i in 5" :key="i">
        <PostVSkeleton />
      </div>
    </div>

    <div v-if="listPost.listPins.length + listPost.listNoPins.length > 0">
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
        <div class="w-full m-5 space-y-5">
          <div v-for="i in listPost.listPins" :key="i.id">
            <PostVMonoD :data="i" />
          </div>
        </div>
      </div>
      <div class="my-5 space-y-5">
        <div v-for="i in listPost.listNoPins" :key="i.id">
          <PostVMonoD :data="i" />
        </div>
      </div>
    </div>

    <div v-else>
      <div class="text-4xl text-center m-5">chưa có bài viết nào cả!!!</div>
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
const useRouteS = routeStore();
const route = useRoute();
const loadingSkeleton = ref(false);

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
        useRouteS.redirectedFrom = "/post/edit";
      }
    );
  } else {
    navigateTo("/post/edit");
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await usePost.findByOther(route.params.id);
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
