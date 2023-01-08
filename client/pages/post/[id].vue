<template>
  <div class="p-5 bg-base-200 rounded-2xl">
    <PostVPost :data="usePost.post" />
    <CommentsVInputCmt
      @send="send"
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
import { postStore } from "~~/stores/post.store";
import { userStore } from "~~/stores/user.store";
import { cmtStore } from "~~/stores/cmt.store";

const route = useRoute();
const usePost = postStore();
const useUser = userStore();
const useCmt = cmtStore();
const resetInput = ref(0);
const dataInput = ref({
  content: {},
  tagname: [],
});

const loading = ref(false);

async function send() {
  loading.value = true;
  let list = [];
  dataInput.value.tagname.forEach((e) => {
    list.push(e.id);
  });
  const data = {
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
      await useCmt.getBy("post", usePost.post.id);
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
}

async function getApi() {
  await usePost.findOne(route.params.id);
  await useUser.findAll();
  await useCmt.getBy("post", route.params.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
