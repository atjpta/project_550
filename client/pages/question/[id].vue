<template>
  <div class="p-5 bg-base-200 rounded-2xl">
    <QuestionVQuestion :data="useQuestion.question" />
    <CommentsVInputCmt
      @send="openDialogSignin(send)"
      :loading="loading"
      :data="dataInput"
      :reset="resetInput"
    />
    <div>
      <div v-for="i in useCmt.list_cmt" :key="i.id">
        <CommentsVCmt :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";
import { cmtStore } from "~~/stores/cmt.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { authStore } from "~~/stores/auth.store";
import { questionStore } from "~~/stores/question.store";

const route = useRoute();
const useQuestion = questionStore();
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

const loading = ref(false);

const send = async () => {
  loading.value = true;
  let list = [];
  dataInput.value.tagname.forEach((e) => {
    list.push(e.id);
  });
  const data = {
    author: useUser.user.id,
    question: useQuestion.question._id,
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
      await useCmt.getBy("question", useQuestion.question._id);
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
        useRouteS.redirectedFrom = `/question/${route.params.id}`;
      }
    );
  } else {
    cb();
  }
}

async function getApi() {
  useCmt.list_cmt = [];
  await useQuestion.findOne(route.params.id);
  await useUser.findAll();
  await useCmt.getBy("question", route.params.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
