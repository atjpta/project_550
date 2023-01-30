<template>
  <div>
    <div class="p-5 bg-base-200 rounded-2xl">
      <TopicVTopic :data="useTopic.topic" />
    </div>
    <div class="text-center uppercase text-3xl font-bold mt-5">
      danh sách các bài viết
    </div>

    <!-- các btn -->
    <div class="justify-between my-3 lg:flex">
      <div class="space-x-1">
        <div v-for="i in 3" :key="i" class="btn btn-primary btn-outline btn-sm lg:btn-md">
          {{ i }} 0000
        </div>
      </div>
      <!-- <button
        v-if="useAuth.isUserLoggedIn && useAuth.user?.id == useTopic.topic.author[0]?._id"
        @click="isTopic = !isTopic"
        class="btn btn-outline btn-success btn-sm lg:btn-md mt-1 lg:mt-0"
      >
        {{ isTopic ? "ẩn bài viết chưa có Topic" : "hiện bài viết chưa có Topic" }}
      </button> -->
    </div>
    <div v-if="listPost.length == 0" class="text-center text-xl">
      chưa có bài viết nào hết !!!
    </div>
    <div v-for="i in listPost" :key="i.id">
      <TopicVMonoQuestion :data="i" />
    </div>
  </div>
</template>

<script setup>
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { authStore } from "~~/stores/auth.store";
import { topicStore } from "~~/stores/topic.store";
import { questionStore } from "~~/stores/question.store";

const route = useRoute();
const useTopic = topicStore();
const useQuestion = questionStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();

const loading = ref(false);
const isTopic = ref(false);

const listPost = computed(() => {
  if (isTopic.value) {
    return useQuestion.listNoTopic;
  } else return useQuestion.list;
});
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
  await useTopic.findOne(route.params.id);
  await useQuestion.findByTopic(route.params.id);
  await useQuestion.findByNoTopic(useAuth.user.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
