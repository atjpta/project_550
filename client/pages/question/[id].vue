<template>
  <div class="">
    <div v-if="loadingSkeleton">
      <QuestionVSkeleton />
    </div>
    <div v-else
      class="hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-5">
      <QuestionVQuestion :data="useQuestion.question" />
      <!-- các bài viết liên quan -->
      <div>
        <div class="text-2xl font-semibold">Các bài liên quan</div>
        <div class="carousel space-x-5 my-3">
          <div class="carousel-item" v-for="i in listOther" :key="i">
            <QuestionVMonoOther :data="i" />
          </div>
        </div>
      </div>
      <!-- chọn cái xem -->
      <div class="tabs mt-10 mb-3">
        <div @click="selectviewcmt = false" :class="!selectviewcmt ? 'tab-active text-primary' : ''"
          class="tab tab-bordered uppercase font-medium">
          xem câu trả lời
        </div>
        <div @click="selectviewcmt = true" :class="selectviewcmt ? 'tab-active text-primary' : ''"
          class="tab tab-bordered uppercase font-medium">
          xem bình luận
        </div>
      </div>
      <div v-if="selectviewcmt">
        <!-- bình luận của câu hỏi -->
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
                <OtherVIcon class-icon="text-primary mr-1" icon="fa-solid fa-filter" />
              </div>

              {{ filterCmt ? "điểm cao nhất" : "mới nhất" }}
            </div>
          </div>
        </div>
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

      <div v-else>
        <!-- nhập câu trả lời -->
        <div>
          <div class="flex justify-between">
            <div @click="openInputAnswer = !openInputAnswer" class="btn btn-sm text-success btn-ghost">
              Nhập câu trả lời
            </div>
            <div>
              <div @click="filterAnswer = !filterAnswer" class="btn btn-sm btn-ghost mb-2">
                <div class="tooltip ml-2" data-tip="lọc bình luận">
                  <OtherVIcon class-icon="text-primary mr-1" icon="fa-solid fa-filter" />
                </div>
                {{ filterAnswer ? "điểm cao nhất" : "mới nhất" }}
              </div>
            </div>
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

          <div v-if="loadingAnswer" class="mb-3">
            <div v-for="(i, n) in 9" :key="i">
              <div class="animate-pulse bg-base-300 h-32 w-full">
                <div></div>
              </div>
              <div v-if="n < 8" class="divider my-0"></div>
            </div>
          </div>
          <div v-else>
            <div v-for="i in dataPerPageA" :key="i">
              <AnswerVAnswer :data="i" />
              <!-- <div v-if="n < list_answer.listAnswer.length - 1" class="divider my-0"></div> -->
            </div>
          </div>
        </div>
        <!-- btn chuyển trang cmt -->
        <div v-if="dataPerPageA.length > 0" class="form-control mx-auto w-fit">
          <div class="input-group lg:input-group-md input-group-sm">
            <button @click="goToPreA()" :disabled="selectPageA == 1" class="btn btn-sm">
              <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-left" />
            </button>
            <select v-model="selectPageA" class="select select-bordered select-sm">
              <option :value="i" :disabled="i == selectPageA" v-for="i in maxPageA" :key="i">
                trang {{ i }}
              </option>
            </select>
            <button @click="goToNextA()" :disabled="selectPageA == maxPageA" class="btn btn-sm text-2xl">
              <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-right" />
            </button>
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
import { alertStore } from "~/stores/alert.store";

const selectviewcmt = ref(false);
const route = useRoute();
const useQuestion = questionStore();
const useUser = userStore();
const useAlert = alertStore();
const useCmt = cmtStore();
const useAnswer = answerStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();
const useNotification = notificationStore();
const resetInput = ref(0);
const listOther = ref();
const loadingSkeleton = ref(false);
const filterCmt = ref(false);
const loadingCmt = ref(false);

const filterAnswer = ref(false);
const loadingAnswer = ref(false);

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

const maxPageA = computed(() => {
  selectPageA.value = 1;
  return Math.ceil(useAnswer.list_answer.length / size);
});
const selectPageA = ref(1);

const dataPerPageA = computed(() => {
  let list = [];
  let index = size * (selectPageA.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < list_answer.value.length) list.push(list_answer.value[index]);
    index++;
  }

  return list;
});

function goToPreA() {
  selectPageA.value -= 1;
}

function goToNextA() {
  selectPageA.value += 1;
}

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
  return [...listAnswer, ...listNoAnswer];
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
    content: `Bạn có câu trả lời mới về câu hỏi "${useQuestion.question.title}"`,
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
    content: `Bạn có bình luận mới về câu hỏi "${useQuestion.question.title}"`,
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
        content: "Bạn cần đăng nhập để dùng chức năng",
        btn1: "Đăng nhập",
        btn2: "Hủy",
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

async function getOther() {
  try {
    if (useQuestion.question.tag) {
      const index = Math.floor(Math.random() * useQuestion.question.tag.size);
      const array = Array.from(useQuestion.question.tag);

      listOther.value = await useQuestion.findOther(route.params.id, array[index]._id);
    } else {
      listOther.value = await useQuestion.findOther(route.params.id);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    useCmt.list_cmt = [];
    await useQuestion.findOne(route.params.id);
    if (!useQuestion.question.isPublic || !useQuestion.question.check) {
      if (useUser.isAdmin) {
      } else {
        if (useQuestion.question.author[0]._id != useAuth.user?.id) {
          useAlert.setWarning("Câu hỏi riêng tư, bạn không thể vào được!!");
          return navigateTo("/");
        }
        if (!useAuth.user) {
          useAlert.setWarning("Câu hỏi riêng tư, bạn không thể vào được!!");
          return navigateTo("/");
        }
      }
    }

    await useUser.findAll();
    await useCmt.getBy("post", route.params.id);
    await useAnswer.getBy(route.params.id);
    await getOther();
    loadingSkeleton.value = false;
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

watch(filterAnswer, async () => {
  if (filterAnswer.value) {
    try {
      loadingAnswer.value = true;
      await useAnswer.getBy(route.params.id, "vote");
      loadingAnswer.value = false;
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      loadingAnswer.value = true;
      await useAnswer.getBy(route.params.id, "new");
      loadingAnswer.value = false;
    } catch (error) {
      console.log(error);
    }
  }
});

onMounted(() => {
  getApi();
});

const title = computed(() => {
  return useQuestion.question?.title;
});

useHead({
  title: title,
});
</script>

<style></style>
