<template>
  <div class="rounded-2xl">
    <!-- các tùy chọn -->
    <div class="glass rounded-2xl ring-0 p-2 lg:flex justify-between sticky top-14 z-10">
      <div class="w-fit">
        <nuxtLink class="hover:text-sky-500 hover:scale-110 duration-500" :to="`/user/${data?.author[0]?._id}/overview`">
          <!-- tác giả -->
          <div class="flex">
            <div class="avatar">
              <div class="w-12 h-12 rounded-full">
                <img :src="data.author[0]?.avatar_url" />
              </div>
            </div>
            <div class="text-2xl mx-3">
              {{ data.author[0]?.name }}
              <div class="text-sm italic">
                <i>{{ data.createdAt || "vừa xong" }}</i>
              </div>
            </div>
          </div>
        </nuxtLink>
      </div>
      <!-- các btn -->
      <div class="flex">
        <div class="flex justify-evenly mr-2">
          <div data-tip="Tăng điểm" class="tooltip">
            <div v-if="loading != 'up'" @click="openDialogSignin(up)" :class="classUp"
              class="btn-sm lg:btn-md btn btn-circle btn-ghost">
              <OtherVIcon class-icon="text-3xl" icon="fa-solid fa-caret-up" />
            </div>
          </div>
          <div v-if="loading == 'up'" class="btn-sm lg:btn-md btn btn-circle btn-ghost loading"></div>

          <div class="btn-sm lg:btn-md btn btn-circle btn-ghost no-animation">
            <div class="text-2xl">{{ valVote }}</div>
          </div>
          <div data-tip="Giảm điểm" class="tooltip">
            <div v-if="loading != 'down'" @click="openDialogSignin(down)" :class="classDown"
              class="btn-sm lg:btn-md btn btn-circle btn-ghost">
              <OtherVIcon class-icon="text-3xl" icon="fa-solid fa-caret-down" />
            </div>
          </div>
          <div v-if="loading == 'down'" class="btn-sm lg:btn-md btn btn-circle btn-ghost loading"></div>
        </div>
        <div class="tooltip" data-tip="Lưu câu hỏi">
          <div v-if="loading != 'save'" @click="openDialogSignin(save)" :class="classSave"
            class="btn-sm lg:btn-md btn btn-ghost btn-square">
            <OtherVIcon class-icon="text-xl" icon="fa-solid fa-bookmark" />
          </div>
          <div v-if="loading == 'save'" class="btn-sm lg:btn-md btn btn-circle btn-ghost loading"></div>
        </div>

        <!-- thông báo  -->
        <div v-if="useFollow.follow && useAuth.user" class="ml-1 tooltip"
          :data-tip="useFollow.follow.notification ? 'Tắt thông báo' : 'Bật thông báo'">
          <div @click="setOnAndoff()" :class="loading == 'notification' ? 'loading' : ''"
            class="btn-sm lg:btn-md btn btn-ghost btn-square">
            <OtherVIcon class-icon="text-xl text-warning" :icon="useFollow.follow.notification
                ? 'fa-solid fa-bell-slash'
                : 'fa-solid fa-bell'
              " />
          </div>
        </div>

        <div class="tooltip flex" data-tip="Lượt trả lời">
          <a class="btn-sm lg:btn-md btn btn-ghost">
            <OtherVIcon :class-icon="haveAnswerChoice ? 'text-success text-2xl' : ' text-2xl'"
              :icon="haveAnswerChoice ? 'fa-solid fa-check' : 'fa-solid fa-question'" />
            <div class="text-2xl">
              {{ countAnwser }}
            </div>
          </a>
        </div>
        <div class="tooltip flex" data-tip="Lượt bình luận">
          <a href="#comment" class="btn-sm lg:btn-md btn btn-ghost">
            <OtherVIcon class-icon="text-xl mr-1 text-primary" icon="fa-solid fa-comments" />
            <div class="text-2xl">
              {{ data.comment && data.comment.length > 0 ? data.comment[0].count : "0" }}
            </div>
          </a>
        </div>
        <div class="tooltip flex" data-tip="Lượt xem">
          <div class="btn-sm lg:btn-md btn btn-ghost">
            <OtherVIcon class-icon="text-xl mr-1 text-info" icon="fa-solid fa-eye" />
            <div class="text-2xl">
              {{ data.view }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- bài viết -->
    <div class="">
      <img class="rounded-2xl" :src="useImage.previewImage || data.image_cover_url" alt="" />
      <div class="text-4xl font-bold uppercase mt-2">{{ data.title }}</div>
      <div class="-z-30">
        <QuillEditor ref="quill" :readOnly="true" theme="bubble" :toolbar="[]" />
      </div>
      <!-- tag -->
      <div class="mt-4 flex">
        <div v-for="i in data.tag" :key="i._id" class="">
          <nuxt-link :to="`/tag/${i._id}/post`" class="btn btn-ghost bg-base-100/50 btn-sm mr-1 mt-1">{{ "#" + i.name
          }}</nuxt-link>
        </div>
      </div>
      <div v-if="data.course[0]">
        <div class="text-2xl font-semibold">Môn học</div>
        <nuxtLink :to="`/course/${data.course[0]._id}/review`" class="btn btn-ghost justify-start">{{ data.course[0].name
        }}
        </nuxtLink>
      </div>
      <!-- phần series -->
      <div v-if="data.topic?.length > 0" class="mt-5">
        <div class="text-2xl font-semibold">Chủ đề</div>
        <nuxtLink :to="`/topic/${data.topic[0]?._id}`" class="btn btn-ghost justify-start">{{ data.topic[0]?.name }}
        </nuxtLink>
      </div>
      <!-- phần team -->
      <div v-if="data.team?.length > 0" class="mt-5">
        <div class="text-2xl font-semibold">Nhóm</div>
        <nuxtLink :to="`/team/${data.team[0]?._id}/read/post`" class="btn btn-ghost justify-start">{{ data.team[0]?.name
        }}
        </nuxtLink>
      </div>
    </div>

    <div id="comment"></div>
  </div>
</template>

<script setup>
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import { imageStore } from "~~/stores/image.store";
import { authStore } from "~~/stores/auth.store";
import { voteStore } from "~~/stores/vote.store";
import { postStore } from "~~/stores/post.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { followStore } from "~~/stores/follow.store";
const useImage = imageStore();
const useAuth = authStore();
const useVote = voteStore();
const usePost = postStore();
const useRouteS = routeStore();
const route = useRoute();
const useFollow = followStore();
const useDialog = dialogStore();
const props = defineProps({
  data: Object,
  change: Object,
});

const loading = ref("");

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

const haveAnswerChoice = computed(() => {
  if (props.data.choice && props.data.choice.length > 0) {
    return true;
  }
  return false;
});

const countAnwser = computed(() => {
  if (props.data.answer) {
    return props.data.answer[0]?.count ?? "0";
  }
  return "0";
});

const classUp = computed(() => {
  if (useAuth.user) {
    if (props.data.author) {
      if (props.data.author[0]?._id == useAuth.user.id) {
        return "btn-disabled bg-transparent";
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
      if (props.data.author[0]?._id == useAuth.user.id) {
        return "btn-disabled bg-transparent";
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

const classSave = computed(() => {
  if (useAuth.user) {
    if (props.data.author) {
      if (props.data.author[0]?._id == useAuth.user.id) {
        return "btn-disabled bg-transparent";
      }
    }
    if (useFollow.follow) {
      return "text-primary";
    }
  }
  return "";
});

let mark = 0;

const quill = ref();

const setContent = () => {
  quill.value.setContents(props.data.content);
};

function test() {
  console.log("test");
}

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
        post: props.data._id,
      });
      if (props.data.vote.length > 0) {
        props.data.vote_user[0].val += 1;
        props.data.vote[0].val += 1;
      } else {
        await useVote.findOne(id);
        props.data.vote_user = [];
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
        post: props.data._id,
      });
      if (props.data.vote.length > 0) {
        props.data.vote_user[0].val -= 1;
        props.data.vote[0].val -= 1;
      } else {
        await useVote.findOne(id);
        props.data.vote_user = [];
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
        useRouteS.redirectedFrom = `/question/${props.data._id}`;
      }
    );
  } else {
    cb();
  }
}

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
        user: props.data._id,
        follow: useAuth.user.id,
      };
      await useFollow.create(data);
    } else {
      await useFollow.deleteOne(useFollow.follow.id);
    }
    await getFollow();
  } catch (error) {
    console.log(erorr);
    console.log("lỗi save");
  } finally {
    loading.value = "";
  }
};

async function setOnAndoff() {
  try {
    const data = {
      id: useFollow.follow.id,
      notification: true,
    };
    loading.value = "notification";
    if (useFollow.follow.notification) {
      data.notification = false;
    }
    await useFollow.update(data);
    await getFollow();
  } catch (error) {
    console.log(erorr);
    console.log("lỗi save");
  } finally {
    loading.value = "";
  }
}

onMounted(() => {
  setContent();
  getFollow();
});
</script>

<style></style>
