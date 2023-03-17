<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="space-x-1">
        <div v-for="i in 3" :key="i" class="btn btn-primary btn-outline btn-sm lg:btn-md">
          lọc
        </div>
      </div>
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md"
      >
        tạo bài viết
      </button>
    </div>

    <div v-if="loading">
      <div class="my-5 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        <div v-for="item in 9" :key="item.id">
          <PostVSkeleton />
        </div>
      </div>
    </div>

    <div class="my-5 lg:grid hidden grid-cols-3 space-x-5">
      <div class="space-y-5">
        <div v-for="i in posts.list31" :key="i.id">
          <PostVMono :data="i" />
        </div>
      </div>
      <div class="space-y-5">
        <div v-for="i in posts.list32" :key="i.id">
          <PostVMono :data="i" />
        </div>
      </div>
      <div class="space-y-5">
        <div v-for="i in posts.list33" :key="i.id">
          <PostVMono :data="i" />
        </div>
      </div>
    </div>

    <div class="my-5 md:grid lg:hidden hidden grid-cols-2 space-x-5">
      <div class="space-y-5">
        <div v-for="i in posts.list21" :key="i.id">
          <PostVMono :data="i" />
        </div>
      </div>
      <div class="space-y-5">
        <div v-for="i in posts.list22" :key="i.id">
          <PostVMono :data="i" />
        </div>
      </div>
    </div>

    <div class="my-5 space-y-5 md:hidden">
      <div v-for="i in usePost.list" :key="i.id">
        <PostVMono :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { postStore } from "~~/stores/post.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";

const usePost = postStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const loading = ref(false);
const posts = ref({});
function formatList(list) {
  const listdata = {
    list31: [],
    list32: [],
    list33: [],
    list21: [],
    list22: [],
  };
  list.forEach((e, i) => {
    if (i % 3 == 0) {
      listdata.list31.push(e);
    }
    if (i % 3 == 1) {
      listdata.list32.push(e);
    }
    if (i % 3 == 2) {
      listdata.list33.push(e);
    }
    if (i % 2 == 0) {
      listdata.list21.push(e);
    }
    if (i % 2 == 1) {
      listdata.list22.push(e);
    }
  });
  return listdata;
}

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
  loading.value = true;

  try {
    await usePost.findAll();
    posts.value = formatList(usePost.list);
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  useRouteS.cb = getApi;
  getApi();
});
</script>

<style></style>
