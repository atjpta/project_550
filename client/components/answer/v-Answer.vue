<template>
  <div v-if="data.author" class="mb-5">
    <div :class="[
      data.choice
        ? 'bg-gradient-to-r from-success/10 via-success/5 to-pink-500/0'
        : 'bg-gradient-to-r from-info/10 via-info/5 to-pink-500/0',
    ]" class="rounded-2xl hover:bg-gradient-to-l">
      <div class="rounded-2xl px-5 py-3 flex">
        <!-- phần người gửi -->
        <div>
          <div class="flex">
            <!-- các btn -->
            <div class="flex flex-col mr-2 space-y-1">
              <div v-if="loading == 'up'" class="btn-sm btn btn-circle btn-ghost loading text-2xl"></div>
              <div v-else-if="loadingVote != 'up'" @click="openDialogSignin(up)" :class="classUp"
                class="btn-sm btn-circle btn btn-ghost text-2xl">
                <OtherVIcon class-icon="" icon="fa-solid fa-caret-up" />
              </div>

              <div class="btn-sm btn-circle btn btn-ghost no-animation">
                {{ valVote }}
              </div>
              <div v-if="loading == 'down'" class="btn-sm btn btn-circle btn-ghost loading text-2xl"></div>
              <div v-else-if="loadingVote != 'down'" @click="openDialogSignin(down)" :class="classDown"
                class="btn-sm btn-circle btn btn-ghost text-2xl">
                <OtherVIcon class-icon="" icon="fa-solid fa-caret-down" />
              </div>

              <div v-if="isAuthorQuestion && !loading" @click="choice()" :class="[data.choice ? 'text-success' : '']"
                class="btn-sm btn-circle btn btn-ghost">
                <OtherVIcon class-icon="text-2xl" icon="fa-solid fa-check" />
              </div>
              <div v-else-if="isAuthorQuestion && loading" class="btn-sm btn-circle btn btn-ghost loading"></div>
              <div v-else-if="data.choice" class="btn-sm btn-circle btn btn-ghost no-animation text-success">
                <OtherVIcon class-icon="text-2xl" icon="fa-solid fa-check" />
              </div>
            </div>
            <!-- tác giả -->
            <div>
              <nuxtLink class="hover:text-sky-500 hover:scale-110 duration-500"
                :to="`/user/${data?.author[0]?._id}/overview`">
                <div class="flex">
                  <div class="avatar">
                    <div class="w-12 h-12 rounded-full">
                      <img :src="data?.author[0]?.avatar_url" />
                    </div>
                  </div>
                  <div class="mx-3">
                    {{ data?.author[0]?.name }}
                    <div class="text-sm italic">
                      <i>{{ data.createdAt || "vừa xong" }}</i>
                    </div>
                  </div>
                </div>
              </nuxtLink>

              <!-- các btn của tác giả -->

              <div v-if="isAuthorAnswer" class="toast toast-top toast-end">
                <div class="flex space-x-1">
                  <div @click="openEditF()" class="tooltip" data-tip="sửa câu trả lời">
                    <div class="btn btn-ghost text-primary">
                      <OtherVIcon icon="fa-solid fa-pen-to-square" />
                    </div>
                  </div>

                  <div class="tooltip" data-tip="xóa câu trả lời">
                    <div @click="openDialogDelete()" class="btn btn-ghost text-error">
                      <OtherVIcon icon="fa-solid fa-trash-can" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- phần nội dung -->
              <div v-if="!openEdit" class="-z-30">
                <QuillEditor :content="data.content" ref="quill" :readOnly="true" theme="bubble" :toolbar="[]" />
              </div>
              <!-- phần edit nội dung -->
              <div v-else class="-z-30">
                <AnswerVInputAnswer @send="update" :loading="loading" :data="dataAnswer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- phần hiện ẩn cmt con -->
    <div class="ml-5 mt-1 flex items-center">
      <div @click="openInputRep()" class="btn btn-sm btn-ghost text-primary">
        Nhập bình luận
        <div class="tooltip ml-2" data-tip="gõ @ để tag tên">
          <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
            <OtherVIcon class-icon="" icon="fa-solid fa-info" />
          </div>
        </div>
      </div>
      <div v-if="countCmt > 0">
        <div @click="showChildCmt()" v-show="!childCmt" class="btn btn-ghost btn-xs italic lowercase">
          hiện {{ countCmt }} bình luận
        </div>
        <div @click="childCmt = !childCmt" v-show="childCmt" class="btn btn-ghost btn-xs italic lowercase">
          ẩn {{ countCmt }} bình luận
        </div>
      </div>
    </div>

    <!-- cmt -->
    <div class="ml-10">
      <!-- input rep cmt -->
      <transition name="bounce">
        <div v-if="inputRep">
          <CommentsVInputCmt @send="openDialogSignin(rep)" :loading="loading" :data="dataInput" :reset="resetInput" />
        </div>
      </transition>
      <!-- list cmt  -->
      <transition name="bounce">
        <div v-if="childCmt">
          <div class="divider my-0"></div>

          <div v-for="(i, n) in list_child" :key="i">
            <CommentsVCmt :data="i" />
            <div v-if="n < list_child.length - 1" class="divider my-0"></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import { postStore } from "~~/stores/post.store";
import { userStore } from "~~/stores/user.store";
import { cmtStore } from "~~/stores/cmt.store";
import cmtService from "~~/services/cmt.service";
import { authStore } from "~~/stores/auth.store";
import { voteStore } from "~~/stores/vote.store";
import { dialogStore } from "../../stores/dialog.store";
import { routeStore } from "~~/stores/route.store";
import { answerStore } from "~~/stores/answer.store";
import { questionStore } from "~~/stores/question.store";

const useAnswer = answerStore();
const useUser = userStore();
const useQuestion = questionStore();
const useCmt = cmtStore();
const useAuth = authStore();
const useVote = voteStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const route = useRoute();
const props = defineProps({
  data: Object,
});

const resetInput = ref(0);
const quill = ref();
const dataInput = ref({
  content: {},
  tagname: [],
});

const dataAnswer = ref({
  content: {},
});

const list_child = ref([]);

const loading = ref(false);
const inputRep = ref(false);
const childCmt = ref(false);
const openEdit = ref(false);
const loadingVote = ref("");

const countCmt = computed(() => {
  if (list_child.value.length) {
    return list_child.value.length;
  }
  return props.data?.comment[0]?.count;
});

const isAuthorQuestion = computed(() => {
  return useQuestion.question?.author[0]?._id == useAuth.user?.id ?? false;
});

const isAuthorAnswer = computed(() => {
  return props.data.author[0]._id == useAuth.user?.id ?? false;
});

const valVote = computed(() => {
  if (props.data.vote) {
    let val = props.data.vote[0]?.val;
    if (val != undefined) {
      if (val > 0) {
        return "+" + val;
      } else if (val == 0) {
        return 0;
      } else return val;
    }
  }
  return 0;
});

const classUp = computed(() => {
  if (useAuth.user) {
    if (props.data.author) {
      if (isAuthorAnswer.value) {
        return "btn-disabled";
      }
    }
    if (props.data.vote_user) {
      if (props.data.vote_user[0]?.author == useAuth.user.id) {
        if (props.data.vote_user[0].val == 1) {
          return "text-primary";
        }
      }
    }
  }
  return "";
});

const classDown = computed(() => {
  if (useAuth.user) {
    if (props.data.author) {
      if (isAuthorAnswer.value) {
        return "btn-disabled";
      }
    }
    if (props.data.vote_user) {
      if (props.data.vote_user[0]?.author == useAuth.user.id) {
        if (props.data.vote_user[0].val == -1) {
          return "text-primary";
        }
      }
    }
  }
  return "";
});

function openEditF() {
  openEdit.value = !openEdit.value;
  dataAnswer.value.content = props.data.content;
}

const update = async () => {
  loading.value = true;
  const data = {
    id: props.data._id,
    content: dataAnswer.value.content,
  };
  try {
    await useAnswer.update(data);
    await useAnswer.getBy(route.params.id);
    dataAnswer.value.content = { ops: [{ insert: "\n" }] };
  } catch (error) {
    console.log("lỗi gửi sendAnswer");
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const up = async () => {
  loading.value = "up";
  try {
    if (props.data.vote_user[0]?.author == useAuth.user.id) {
      if (props.data.vote_user[0].val == 1) {
        await useVote.update(
          {
            val: parseInt(0),
          },
          props.data.vote_user[0]._id
        );
        props.data.vote_user[0].val -= 1;
        props.data.vote[0].val -= 1;
      } else {
        await useVote.update(
          {
            val: parseInt(1),
          },
          props.data.vote_user[0]._id
        );
        if (props.data.vote_user[0].val == 0) {
          props.data.vote[0].val += 1;
        } else {
          props.data.vote[0].val += 2;
        }
        props.data.vote_user[0].val = 1;
      }
    } else {
      let id = await useVote.create({
        author: useAuth.user.id,
        val: parseInt(1),
        answer: props.data._id,
      });
      if (props.data.vote.length > 0) {
        props.data.vote_user[0].val += 1;
        props.data.vote[0].val += 1;
      } else {
        await useVote.findOne(id);
        props.data.vote_user = [];
        useVote.vote._id = useVote.vote.id;
        props.data.vote_user.push(useVote.vote);
        props.data.vote = [];
        props.data.vote.push({
          val: 1,
          _id: props.data._id,
        });
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = "";
  }
};

const down = async () => {
  loading.value = "down";
  try {
    if (props.data.vote_user[0]?.author == useAuth.user.id) {
      if (props.data.vote_user[0].val == -1) {
        await useVote.update(
          {
            val: parseInt(0),
          },
          props.data.vote_user[0]._id
        );
        props.data.vote_user[0].val += 1;
        props.data.vote[0].val += 1;
      } else {
        await useVote.update(
          {
            val: parseInt(-1),
          },
          props.data.vote_user[0]._id
        );
        if (props.data.vote_user[0].val == 0) {
          props.data.vote[0].val -= 1;
        } else {
          props.data.vote[0].val -= 2;
        }
        props.data.vote_user[0].val = -1;
      }
    } else {
      let id = await useVote.create({
        author: useAuth.user.id,
        val: parseInt(-1),
        answer: props.data._id,
      });
      if (props.data.vote.length > 0) {
        props.data.vote_user[0].val -= 1;
        props.data.vote[0].val -= 1;
      } else {
        await useVote.findOne(id);
        props.data.vote_user = [];
        useVote.vote._id = useVote.vote.id;
        props.data.vote_user.push(useVote.vote);
        props.data.vote = [];
        props.data.vote.push({
          val: -1,
          _id: props.data._id,
        });
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = "";
  }
};

function openInputRep() {
  inputRep.value = !inputRep.value;
}

async function choice() {
  const data = {
    id: props.data._id,
  };
  if (!props.data.choice) {
    data.choice = true;
  } else {
    data.choice = false;
  }
  try {
    loading.value = true;
    await useAnswer.update(data);
    await useAnswer.getBy(route.params.id);
  } catch (error) {
    console.log("lỗi gửi cmt");
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function showChildCmt() {
  childCmt.value = !childCmt.value;
  await getBy();
}

const rep = async () => {
  loading.value = true;
  let list = [];
  dataInput.value.tagname.forEach((e) => {
    list.push(e.id);
  });
  const data = {
    author: useUser.user.id,
    answer: props.data._id,
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
      await getBy();
      childCmt.value = true;
      dataInput.value.content = { ops: [{ insert: "\n" }] };
      dataInput.value.tagname = [];
      resetInput.value++;
      inputRep.value = false;
    }
  } catch (error) {
    console.log("lỗi gửi cmt");
    console.log(error);
  } finally {
    loading.value = false;
  }
};

async function getBy() {
  const user = useAuth.user ? useAuth.user.id : "";
  const list = await cmtService.getBy("answer", props.data._id, user);
  list.forEach((e, i) => {
    list[i].createdAt = useCmt.setTime(list[i].createdAt);
  });
  list_child.value = list;
}

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

function openDialogDelete() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn xóa câu trả lời?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        await useAnswer.deleteOne(props.data._id);
        await useAnswer.getBy(route.params.id);
      }
    );
  }
}
</script>

<style></style>
