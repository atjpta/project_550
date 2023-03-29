<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-end">
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md"
      >
        tạo câu hỏi
      </button>
    </div>

    <div v-if="loadingSkeleton" class="space-y-5 mt-5">
      <div v-for="i in 5" :key="i">
        <QuestionVSkeleton />
      </div>
    </div>

    <div class="space-y-5 mt-5" v-if="useQuestion.list.length > 0">
      <div v-for="i in useQuestion.list" :key="i.id">
        <QuestionVMonoD :data="i" />
      </div>
    </div>

    <div v-else>
      <div class="text-4xl text-center m-5">chưa có câu hỏi nào cả!!!</div>
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
const useRoute = routeStore();
const loadingSkeleton = ref(false);

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
        useRoute.redirectedFrom = "/post/edit";
      }
    );
  } else {
    navigateTo("/question/edit");
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useQuestion.findByAuthor(useAuth.user.id);
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
