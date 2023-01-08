<template>
  <div>
    <div class="bg-base-100 rounded-2xl px-5 py-3 flex mt-5 shadow-md glass">
      <!-- phần người gửi -->
      <div>
        <div class="flex">
          <!-- các btn -->
          <div class="flex flex-col mr-2 space-y-1">
            <div
              v-if="loadingVote != 'up'"
              @click="up()"
              :class="classUp"
              class="btn-sm btn-circle btn btn-outline"
            >
              <OtherVIcon class-icon="" icon="fa-solid fa-caret-up" />
            </div>
            <div
              v-if="loading == 'up'"
              class="btn-sm lg:btn-md btn btn-circle btn-outline loading"
            ></div>
            <div class="btn-sm btn-circle btn btn-ghost no-animation">{{ valVote }}</div>
            <div
              v-if="loadingVote != 'down'"
              @click="down()"
              :class="classDown"
              class="btn-sm btn-circle btn btn-outline"
            >
              <OtherVIcon class-icon="" icon="fa-solid fa-caret-down" />
            </div>
            <div
              v-if="loading == 'down'"
              class="btn-sm lg:btn-md btn btn-circle btn-outline loading"
            ></div>
            <div @click="openInputRep()" class="btn-sm btn-circle btn btn-outline">
              <OtherVIcon class-icon="" icon="fa-solid fa-share" />
            </div>
          </div>
          <!-- tác giả -->
          <div class="w-fit">
            <nuxtLink
              class="hover:text-sky-500 hover:scale-110 duration-500"
              to="/user/1"
            >
              <div class="flex">
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full">
                    <img :src="data.author[0].avatar_url" />
                  </div>
                </div>
                <div class="mx-3">
                  {{ data.author[0].name }}
                  <div class="text-sm italic">
                    <i>{{ data.createdAt || "vừa xong" }}</i>
                  </div>
                </div>
              </div>
            </nuxtLink>
            <!-- phần tag name -->
            <div
              v-for="i in data.tag_name"
              :key="i"
              class="btn btn-info btn-sm btn-outline mt-2"
            >
              {{ "@" + i.name }}
            </div>
            <!-- phần nội dung -->
            <div class="-z-30">
              <QuillEditor
                ref="quill"
                :content="data.content"
                :readOnly="true"
                theme="bubble"
                :toolbar="[]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- phần hiện ẩn cmt con -->
    <div v-if="data.child.length > 0" class="w-4/5 mx-auto">
      <div
        @click="showChildCmt()"
        v-if="!childCmt"
        class="btn btn-ghost btn-xs italic lowercase"
      >
        hiện {{ data.child[0].count }} bình luận con
      </div>
      <div
        @click="childCmt = !childCmt"
        v-else
        class="btn btn-ghost btn-xs italic lowercase"
      >
        ẩn {{ data.child[0].count }} bình luận con
      </div>
    </div>
    <!-- input rep cmt -->
    <transition name="bounce">
      <div v-if="inputRep">
        <CommentsVInputCmt
          @send="rep()"
          :loading="loading"
          :data="dataInput"
          :reset="resetInput"
        />
      </div>
    </transition>
    <!-- cmt con -->
    <transition name="bounce">
      <div v-if="childCmt" class="ml-5">
        <div v-for="i in list_child" :key="i._id">
          <CommentsVCmt :data="i" />
        </div>
      </div>
    </transition>
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
const usePost = postStore();
const useUser = userStore();
const useCmt = cmtStore();
const useAuth = authStore();
const useVote = voteStore();

const props = defineProps({
  data: Object,
});

const resetInput = ref(0);
const dataInput = ref({
  content: {},
  tagname: [],
});
const list_child = ref();

const loading = ref(false);
const inputRep = ref(false);
const childCmt = ref(false);

const loadingVote = ref("");

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
  if (props.data.author) {
    if (props.data.author[0]?._id == useAuth.user.id) {
      return "btn-disabled";
    }
  }
  if (props.data.vote_user) {
    if (props.data.vote_user[0]?.author == useAuth.user.id) {
      if (props.data.vote_user[0].val == 1) {
        return "btn-primary";
      }
    }
  }
  return "";
});

const classDown = computed(() => {
  if (props.data.author) {
    if (props.data.author[0]?._id == useAuth.user.id) {
      return "btn-disabled";
    }
  }
  if (props.data.vote_user) {
    if (props.data.vote_user[0]?.author == useAuth.user.id) {
      if (props.data.vote_user[0].val == -1) {
        return "btn-primary";
      }
    }
  }
  return "";
});

async function up() {
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
}

async function down() {
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
      await useVote.create({
        author: useAuth.user.id,
        val: parseInt(1),
        comment: props.data._id,
      });
      if (props.data.vote.length > 0) {
        props.data.vote_user[0].val -= 1;
        props.data.vote[0].val -= 1;
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
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = "";
  }
}

function openInputRep() {
  inputRep.value = !inputRep.value;
}

function showChildCmt() {
  childCmt.value = !childCmt.value;
  getBy();
}

async function rep() {
  loading.value = true;
  let list = [];
  dataInput.value.tagname.forEach((e) => {
    list.push(e.id);
  });
  const data = {
    cmt_parent: props.data._id,
    author: useUser.user.id,
    post: usePost.post.id,
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
      // await useCmt.getBy("post", usePost.post.id);
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
}

async function getBy() {
  list_child.value = await cmtService.getBy("child", props.data._id, useAuth.user.id);
  list_child.value.forEach((e, i) => {
    list_child.value[i].createdAt = useCmt.setTime(list_child.value[i].createdAt);
  });
  console.log(list_child.value);
}

async function getBy2(id) {
  list_child.value = await cmtService.getBy("child", id, useAuth.user.id);
  list_child.value.forEach((e, i) => {
    list_child.value[i].createdAt = useCmt.setTime(list_child.value[i].createdAt);
  });
  console.log(list_child.value);
}

onUnmounted(() => {
  useCmt.list_cmt = [];
});
</script>

<style></style>
