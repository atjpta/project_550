<template>
  <div class="p-5 bg-base-200 rounded-2xl">
    <PostVPost :data="usePost.post" />
    <div @click="openInputCmt = !openInputCmt" class="btn btn-primary btn-outline mb-2">
      Nhập bình luận
      <div class="tooltip ml-2" data-tip="gõ @ để tag tên">
        <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
          <OtherVIcon class-icon="" icon="fa-solid fa-info" />
        </div>
      </div>
    </div>
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
</template>

<script setup>
import { postStore } from "~~/stores/post.store";
import { userStore } from "~~/stores/user.store";
import { cmtStore } from "~~/stores/cmt.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { authStore } from "~~/stores/auth.store";

const route = useRoute();
const usePost = postStore();
const useUser = userStore();
const useCmt = cmtStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();
const resetInput = ref(0);
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

  try {
    if (
      data.content.ops.length > 1 ||
      typeof data.content.ops[0].insert != "string" ||
      data.content.ops[0].insert.trim() != "" ||
      data.tag_name.length
    ) {
      await useCmt.create(data);
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
  useCmt.list_cmt = [];
  await usePost.findOne(route.params.id);
  await useUser.findAll();
  await useCmt.getBy("post", route.params.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
