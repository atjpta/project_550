<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="flex flex-wrap">
        <nuxtLink
          :to="i.url"
          v-for="i in datafilter"
          :key="i"
          class="mr-1 mb-1 btn btn-outline btn-sm lg:btn-md"
        >
          {{ i.name }}
        </nuxtLink>
      </div>
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md"
      >
        tạo câu hỏi
      </button>
    </div>
    <div class="mt-5 space-y-5" v-if="loadingSkeleton">
      <div v-for="i in 9" :key="i">
        <QuestionVSkeleton />
      </div>
    </div>
    <div v-else class="mt-5 space-y-5">
      <div v-for="i in useQuestion.list" :key="i.id">
        <QuestionVMono :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { questionStore } from "~~/stores/question.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "~~/stores/dialog.store";

const useQuestion = questionStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const loadingSkeleton = ref(false);
const datafilter = ref([
  {
    name: "mới nhất",
    url: "/question/new/0",
  },
  {
    name: "điểm cao nhất",
    url: "/question/score/0",
  },
  {
    name: "xem nhiều nhất",
    url: "/question/view/0",
  },
  {
    name: "chưa trả lời",
    url: "/question/unreply/0",
  },
]);

function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để tạo câu hỏi",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = "/post/edit";
      }
    );
  } else {
    navigateTo("/question/edit");
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useQuestion.findAll();
    loadingSkeleton.value = false;
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
