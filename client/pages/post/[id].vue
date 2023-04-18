<template>
  <div class="">
    <PostVSkeleton v-if="loadingSkeleton" />
    <div v-else class="hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-5">
      <PostVPost :data="usePost.post" />
      <div class="flex">
        <div @click="openInputCmt = !openInputCmt" class="btn btn-sm btn-ghost text-primary mb-2">
          Nhập bình luận
          <div class="tooltip ml-2" data-tip="gõ @ để tag tên">
            <div class="btn-xs btn btn-info btn-outline btn-circle h-1 w-6">
              <OtherVIcon class-icon="" icon="fa-solid fa-info" />
            </div>
          </div>
        </div>

        <!-- lọc -->
        <!-- <div class="static" @mouseleave="openFilter = false">
          <div @click="openFilter = !openFilter" class="btn btn-ghost btn-sm">
            <OtherVIcon class-icon="" icon="fa-solid fa-filter" />
          </div>

          <div class="bg-base-200 menu fixed top-0" v-if="openFilter">
            <div @click="openFilter = false" class="btn btn-sm btn-ghost text-left">
              mới nhất
            </div>
            <div @click="openFilter = false" class="btn btn-sm btn-ghost text-left">
              điểm cao nhất
            </div>
          </div>
        </div> -->
      </div>
      <!-- list cmt -->

      <div v-if="openInputCmt">
        <CommentsVInputCmt @send="openDialogSignin(send)" :loading="loading" :data="dataInput" :reset="resetInput" />
      </div>

      <div>
        <div v-for="(i, n) in dataPerPage" :key="i">
          <CommentsVCmt :data="i" />
          <div v-if="n < (dataPerPage.length > size ? size : dataPerPage.length) - 1" class="divider my-0"></div>
        </div>
      </div>

      <!-- btn chuyển trang cmt -->

      <div v-if="dataPerPage.length > 0" class="form-control mx-auto w-fit">
        <div class="input-group lg:input-group-md input-group-sm">
          <button @click="goToPre()" :disabled="selectPage == 1" class="btn btn-sm">
            <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-left" />
          </button>
          <select v-model="selectPage" class="select select-bordered select-sm">
            <option :value="i" :disabled="i == selectPage" v-for="i in maxPage" :key="i">
              trang {{ i }}
            </option>
          </select>
          <button @click="goToNext()" :disabled="selectPage == maxPage" class="btn btn-sm text-2xl">
            <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { postStore } from "~~/stores/post.store";
import { userStore } from "~~/stores/user.store";
import { cmtStore } from "~~/stores/cmt.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "~~/stores/dialog.store";
import { authStore } from "~~/stores/auth.store";
import { notificationStore } from "~~/stores/notification.store";
import { alertStore } from "~/stores/alert.store";

const openFilter = ref(false);
const route = useRoute();
const useAlert = alertStore();
const usePost = postStore();
const useUser = userStore();
const useCmt = cmtStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();
const resetInput = ref(0);
const useNotification = notificationStore();
const loadingSkeleton = ref(false);

const size = 5;
const maxPage = computed(() => {
  selectPage.value = 1;
  return Math.ceil(useCmt.list_cmt.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
  let list = [];
  let index = size * (selectPage.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < useCmt.list_cmt.length) list.push(useCmt.list_cmt[index]);
    index++;
  }

  return list;
});

function goToPre() {
  selectPage.value -= 1;
}

function goToNext() {
  selectPage.value += 1;
}

const dataInput = ref({
  content: {},
  tagname: [],
});
const openInputCmt = ref(false);

const loading = ref(false);

const send = async () => {
  loading.value = true;
  let list = [];
  dataInput.value.tagname.forEach((e) => {
    list.push(e.id);
  });
  const data = {
    author: useUser.user.id,
    post: usePost.post._id,
    content: dataInput.value.content,
    tag_name: list,
  };

  const dataNotification = {
    author: useAuth.user.id,
    authorModel: usePost.post.author[0]._id,
    model: usePost.post._id,
    content: `bạn có bình luận mới về bài viết "${usePost.post.title}"`,
    url: route.fullPath + "#comment",
    type: "info",
    // listTagName: list,
  };

  try {
    if (
      data.content.ops.length > 1 ||
      typeof data.content.ops[0].insert != "string" ||
      data.content.ops[0].insert.trim() != "" ||
      data.tag_name.length
    ) {
      await useCmt.create(data);
      await useNotification.create(dataNotification);
      await useCmt.getBy("post", route.params.id);
      dataInput.value.content = { ops: [{ insert: "\n" }] };
      dataInput.value.tagname = [];
      resetInput.value++;
    }
  } catch (error) {
    console.log("lỗi gửi cmt");
    console.log(error);
  } finally {
    loading.value = false;
  }
};

function openDialogSignin(cb) {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để dùng chức năng",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = `/post/${route.params.id}`;
      }
    );
  } else {
    cb();
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    useCmt.list_cmt = [];
    await usePost.findOne(route.params.id);

    await useUser.findAll();
    await useCmt.getBy("post", route.params.id);
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
