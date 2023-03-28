<template>
  <div class="">
    <PostVSkeleton v-if="loadingSkeleton" />
    <div v-else>
      <PostVPost :data="usePost.post" />
      <div class="flex">
        <div
          @click="openInputCmt = !openInputCmt"
          class="btn btn-sm btn-ghost text-primary mb-2"
        >
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
        <CommentsVInputCmt
          @send="openDialogSignin(send)"
          :loading="loading"
          :data="dataInput"
          :reset="resetInput"
        />
      </div>

      <div>
        <div v-for="i in useCmt.list_cmt" :key="i">
          <CommentsVCmt :data="i" />
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

const openFilter = ref(false);
const route = useRoute();
const usePost = postStore();
const useUser = userStore();
const useCmt = cmtStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();
const resetInput = ref(0);
const useNotification = notificationStore();
const loadingSkeleton = ref(false);
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
