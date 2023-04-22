<template>
  <div class="">
    <PostVSkeleton v-if="loadingSkeleton" />
    <div v-else class="hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-5">
      <PostVPost :data="usePost.post" />

      <!-- các bài viết liên quan -->
      <div>
        <div class="text-2xl font-semibold">Các bài liên quan</div>
        <div class="carousel space-x-5 my-3">
          <div class="carousel-item" v-for="i in listOther" :key="i">
            <PostVMonoOther :data="i" />
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <div @click="openInputCmt = !openInputCmt" class="btn btn-sm btn-ghost text-primary mb-2">
          Nhập bình luận
          <div class="tooltip ml-2" data-tip="gõ @ để tag tên">
            <div class="btn-xs btn btn-info btn-outline btn-circle h-1 w-6">
              <OtherVIcon class-icon="" icon="fa-solid fa-info" />
            </div>
          </div>
        </div>
        <div>
          <div @click="filterCmt = !filterCmt" class="btn btn-sm btn-ghost mb-2">
            <div class="tooltip ml-2" data-tip="lọc bình luận">
              <div class="btn-xs btn btn-info btn-ghost h-1 w-6">
                <OtherVIcon class-icon="text-primary" icon="fa-solid fa-filter" />
              </div>
            </div>
            {{ filterCmt ? "điểm cao nhất" : "mới nhất" }}
          </div>
        </div>
      </div>
      <!-- list cmt -->

      <div v-if="openInputCmt">
        <CommentsVInputCmt @send="openDialogSignin(send)" :loading="loading" :data="dataInput" :reset="resetInput" />
      </div>

      <div v-if="loadingCmt" class="mb-3">
        <div v-for="(i, n) in 9" :key="i">
          <div class="animate-pulse bg-base-300 h-32 w-full">
            <div></div>
          </div>
          <div v-if="n < 8" class="divider my-0"></div>
        </div>
      </div>

      <div v-else>
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
const filterCmt = ref(false);
const loadingCmt = ref(false);
const useNotification = notificationStore();
const loadingSkeleton = ref(false);
const listOther = ref();
const size = 9;
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

async function getOther() {
  try {
    if (usePost.post.tag) {
      const index = Math.floor(Math.random() * usePost.post.tag.length);
      listOther.value = await usePost.findOther(route.params.id, usePost.post.tag[index]);
    } else {
      listOther.value = await usePost.findOther(route.params.id);
    }
  } catch (error) {
    console.log(error);
  }
}

watch(filterCmt, async () => {
  if (filterCmt.value) {
    try {
      loadingCmt.value = true;
      await useCmt.getBy("post", route.params.id, "vote");
      loadingCmt.value = false;
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      loadingCmt.value = true;
      await useCmt.getBy("post", route.params.id, "new");
      loadingCmt.value = false;
    } catch (error) {
      console.log(error);
    }
  }
});

async function getApi() {
  loadingSkeleton.value = true;
  try {
    useCmt.list_cmt = [];
    await usePost.findOne(route.params.id);
    if (!usePost.post.isPublic) {
      if (usePost.post.author[0]._id != useAuth.user?.id) {
        useAlert.setWarning("bài viết riêng tư, bạn không thể vào được!!");
        return navigateTo("/");
      }
      if (!useAuth.user) {
        useAlert.setWarning("bài viết riêng tư, bạn không thể vào được!!");
        return navigateTo("/");
      }
    }
    await useUser.findAll();
    await useCmt.getBy("post", route.params.id);
    await getOther();
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getApi();
});

const title = computed(() => {
  return usePost.post?.title;
});

useHead({
  title: title,
});
</script>

<style></style>
