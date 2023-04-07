<template>
  <div class="">
    <div v-if="loadingSkeleton">
      <QuestionVSkeleton />
    </div>
    <div v-else>
      <QuestionVQuestion :data="useQuestion.question" />
      <!-- bình luận của câu hỏi -->
      <div @click="openInputCmt = !openInputCmt" class="btn btn-sm text-primary btn-ghost mb-2">
        Nhập bình luận
        <div class="tooltip ml-2" data-tip="gõ @ để tag tên">
          <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
            <OtherVIcon class-icon="" icon="fa-solid fa-info" />
          </div>
        </div>
      </div>
      <div v-if="openInputCmt">
        <CommentsVInputCmt @send="openDialogSignin(send)" :loading="loading" :data="dataInput" :reset="resetInput" />
      </div>

      <div>
        <div v-for="(i, n) in useCmt.list_cmt" :key="i">
          <CommentsVCmt :data="i" />
          <div v-if="n < useCmt.list_cmt.length - 1" class="divider my-0"></div>
        </div>
      </div>

      <!-- nhập câu trả lời -->
      <div>
        <div @click="openInputAnswer = !openInputAnswer" class="btn btn-sm btn-success mb-2 mt-5">
          Nhập câu trả lời
        </div>
        <div v-if="openInputAnswer">
          <AnswerVInputAnswer @send="openDialogSignin(sendAnswer)" :loading="loading" :data="dataInput"
            :reset="resetInput" />
        </div>
        <div class="lg:flex justify-between mb-3 lg:mb-0">
          <div class="text-2xl font-bold mb-3">
            {{ useAnswer.list_answer.length }} câu trả lời
          </div>
          <!-- <div class="flex space-x-1">
          <div class="btn btn-sm btn-outline">lọc</div>
          <div class="btn btn-sm btn-outline">lọc</div>
          <div class="btn btn-sm btn-outline">lọc</div>
        </div> -->
        </div>
        <div>
          <div v-for="i in list_answer.listAnswer" :key="i">
            <AnswerVAnswer :data="i" />
            <!-- <div v-if="n < list_answer.listAnswer.length - 1" class="divider my-0"></div> -->
          </div>
          <div v-for="i in list_answer.listNoAnswer" :key="i">
            <AnswerVAnswer :data="i" />
            <!-- <div v-if="n < list_answer.listNoAnswer.length - 1" class="divider my-0"></div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";
import { cmtStore } from "~~/stores/cmt.store";
import { answerStore } from "~~/stores/answer.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { authStore } from "~~/stores/auth.store";
import { questionStore } from "~~/stores/question.store";
import { notificationStore } from "~~/stores/notification.store";

const route = useRoute();
const useQuestion = questionStore();
const useUser = userStore();
const useCmt = cmtStore();
const useAnswer = answerStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();
const useNotification = notificationStore();
const resetInput = ref(0);
const loadingSkeleton = ref(false);
const dataInput = ref({
  content: {},
  tagname: [],
});

const list_answer = computed(() => {
  let listAnswer = [];
  let listNoAnswer = [];
  useAnswer.list_answer.forEach((e) => {
    if (e.choice) {
      listAnswer.push(e);
    } else listNoAnswer.push(e);
  });
  return {
    listAnswer,
    listNoAnswer,
  };
});
const openInputCmt = ref(false);
const openInputAnswer = ref(false);
const loading = ref(false);

const sendAnswer = async () => {
  loading.value = true;
  const data = {
    author: useUser.user.id,
    question: useQuestion.question._id,
    content: dataInput.value.content,
  };

  const dataNotification = {
    author: useAuth.user.id,
    authorModel: useQuestion.question.author[0]._id,
    model: useQuestion.question._id,
    content: `bạn có câu trả lời mới về câu hỏi "${useQuestion.question.title}"`,
    url: route.fullPath,
    type: "info",
  };

  try {
    if (
      data.content.ops.length > 1 ||
      typeof data.content.ops[0].insert != "string" ||
      data.content.ops[0].insert.trim() != ""
    ) {
      await useAnswer.create(data);
      await useNotification.create(dataNotification);
      await useAnswer.getBy(route.params.id);
      dataInput.value.content = { ops: [{ insert: "\n" }] };
      dataInput.value.tagname = [];
      resetInput.value++;
    }
    openInputAnswer.value = false;
  } catch (error) {
    console.log("lỗi gửi sendAnswer");
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const send = async () => {
  loading.value = true;
  let list = [];
  dataInput.value.tagname.forEach((e) => {
    list.push(e.id);
  });
  const data = {
    author: useUser.user.id,
    post: useQuestion.question._id,
    content: dataInput.value.content,
    tag_name: list,
  };

  const dataNotification = {
    author: useAuth.user.id,
    authorModel: useQuestion.question.author[0]._id,
    model: useQuestion.question._id,
    content: `bạn có bình luận mới về câu hỏi "${useQuestion.question.title}"`,
    url: route.fullPath,
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
        useRouteS.redirectedFrom = `/question/${route.params.id}`;
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
    await useQuestion.findOne(route.params.id);
    await useUser.findAll();
    await useCmt.getBy("post", route.params.id);
    await useAnswer.getBy(route.params.id);
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
