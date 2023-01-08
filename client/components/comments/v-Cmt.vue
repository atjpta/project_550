<template>
  <div>
    <div class="bg-base-100 rounded-2xl px-5 py-3 flex mt-5 shadow-md glass">
      <!-- phần người gửi -->
      <div>
        <div class="flex">
          <!-- các btn -->
          <div class="flex flex-col mr-2 space-y-1">
            <div class="btn-sm btn-circle btn btn-outline">
              <OtherVIcon class-icon="" icon="fa-solid fa-caret-up" />
            </div>
            <div class="btn-sm btn-circle btn btn-ghost no-animation">0</div>
            <div class="btn-sm btn-circle btn btn-outline">
              <OtherVIcon class-icon="" icon="fa-solid fa-caret-down" />
            </div>
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
                    <img :src="data.author.avatar_url" />
                  </div>
                </div>
                <div class="mx-3">
                  {{ data.author.name }}
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
        <div v-for="i in list_child" :key="i.id">
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
const usePost = postStore();
const useUser = userStore();
const useCmt = cmtStore();

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
  list_child.value = await cmtService.getBy("child", props.data._id);
  list_child.value.forEach((e, i) => {
    list_child.value[i].createdAt = useCmt.setTime(list_child.value[i].createdAt);
  });
}

onUnmounted(() => {
  useCmt.list_cmt = [];
});
</script>

<style></style>
