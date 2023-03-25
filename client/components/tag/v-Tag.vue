<template>
  <div class="indicator w-full">
    <div
      class="bg-gradient-to-r from-info/10 via-info/5 to-pink-500/5 rounded-2xl border-b-4 border-info p-5 w-full"
    >
      <div class="text-4xl font-bold uppercase mb-3">#{{ useTag.tag.name }}</div>
      <div class="text-xl indent-8">
        {{ useTag.tag.introduce || "chưa có mô tả về tag này" }}
      </div>
    </div>
    <div class="indicator-item mr-10 mt-10">
      <div
        v-if="loading != 'save'"
        @click="openDialogSignin(save)"
        :class="classSave"
        class="btn-sm lg:btn-md btn btn-ghost btn-square"
      >
        <OtherVIcon class-icon="text-xl" icon="fa-solid fa-bookmark" />
      </div>
      <div
        v-if="loading == 'save'"
        class="btn-sm lg:btn-md btn btn-circle btn-ghost loading"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { tagStore } from "~~/stores/tag.store";
import { authStore } from "~~/stores/auth.store";
import { voteStore } from "~~/stores/vote.store";
import { postStore } from "~~/stores/post.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { followStore } from "~~/stores/follow.store";
const useAuth = authStore();
const useVote = voteStore();
const usePost = postStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useFollow = followStore();
const useTag = tagStore();
const route = useRoute();
const loading = ref("");

const classSave = computed(() => {
  if (useAuth.user) {
    if (useTag.tag.author) {
      if (useTag.tag.author == useAuth.user.id) {
        return "btn-disabled";
      }
    }
    if (useFollow.follow) {
      return "text-primary";
    }
  }
  return "";
});

async function getFollow() {
  if (useAuth.user?.id) {
    await useFollow.findByFollow(route.params.id, useAuth.user.id);
  }
}

const save = async () => {
  try {
    loading.value = "save";
    if (!useFollow.follow) {
      const data = {
        user: useTag.tag.id,
        follow: useAuth.user.id,
      };
      await useFollow.create(data);
    } else {
      await useFollow.deleteOne(useFollow.follow.id);
    }
    await getFollow();
    loading.value = "";
  } catch (error) {
    console.log(erorr);
    console.log("lỗi save");
  } finally {
    loading.value = "";
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
        useRouteS.redirectedFrom = route.fullPath;
      }
    );
  } else {
    cb();
  }
}

onMounted(() => {
  getFollow();
});
</script>

<style></style>
