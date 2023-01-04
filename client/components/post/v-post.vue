<template>
  <div class="bg-base-200 rounded-2xl">
    <!-- các tùy chọn -->
    <div
      class="glass z-10 rounded-2xl p-2 my-2 lg:flex justify-between shadow-md sticky top-3"
    >
      <div class="w-fit">
        <nuxtLink class="hover:text-sky-500 hover:scale-110 duration-500" to="/user/1">
          <!-- tác giả -->
          <div class="flex">
            <div class="avatar">
              <div class="w-12 h-12 rounded-full">
                <img :src="data.author.avatar_url" />
              </div>
            </div>
            <div class="text-2xl mx-3">
              {{ data.author.name }}
              <div class="text-sm italic">
                <i>{{ data.createdAt || "vừa xong" }}</i>
              </div>
            </div>
          </div>
        </nuxtLink>
      </div>
      <!-- các btn -->
      <div class="flex">
        <div class="btn-sm lg:btn-md btn btn-ghost">
          <OtherVIcon class-icon="text-3xl" icon="fa-solid fa-caret-up" />
        </div>
        <div class="text-2xl font-medium lg:mt-2">0</div>
        <div class="btn-sm lg:btn-md btn btn-ghost">
          <OtherVIcon class-icon="text-3xl" icon="fa-solid fa-caret-down" />
        </div>
        <div class="btn-sm lg:btn-md btn btn-ghost">
          <OtherVIcon class-icon="text-2xl" icon="fa-solid fa-bookmark" />
        </div>
        <div class="btn-sm lg:btn-md btn btn-ghost">
          <OtherVIcon class-icon="text-2xl mr-1" icon="fa-solid fa-eye" />
          <div class="text-2xl">0</div>
        </div>
        <a href="#comment" class="btn-sm lg:btn-md btn btn-ghost text-2xl">
          <OtherVIcon class-icon="text-2xl mr-1" icon="fa-solid fa-comments" />
          <div class="text-2xl">0</div>
        </a>
      </div>
    </div>
    <!-- bài viết -->
    <div class="">
      <img
        class="rounded-2xl"
        :src="useImage.previewImage || data.image_cover_url"
        alt=""
      />
      <div class="text-4xl font-bold uppercase mt-2">{{ data.title }}</div>
      <div class="-z-30">
        <QuillEditor ref="quill" :readOnly="true" theme="bubble" :toolbar="[]" />
      </div>
      <!-- tag -->
      <div class="mt-4">
        <div v-for="i in data.tag" :key="i" class="btn btn-outline btn-sm mr-1 mt-1">
          {{ i.name }}
        </div>
      </div>
      <!-- phần series -->
      <div v-if="data.series.name" class="mt-5">
        <div class="text-2xl font-semibold">series</div>
        <div class="btn btn-ghost justify-start">{{ data.series.name }}</div>
      </div>
      <!-- phần team -->
      <div v-if="data.team.name" class="mt-5">
        <div class="text-2xl font-semibold">nhóm</div>
        <div class="btn btn-ghost justify-start">{{ data.team.name }}</div>
      </div>
    </div>

    <div class="divider"></div>

    <div id="comment">
      <div class="text-2xl font-semibold mb-2">Nhập bình luận</div>
      <div class="-z-30">
        <QuillEditor theme="snow" toolbar="full" />
      </div>
      <div class="btn btn-primary btn-outline btn-sm my-2">
        <OtherVIcon class-icon="mr-1" icon="fa-solid fa-paper-plane" />
        gửi
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import { imageStore } from "~~/stores/image.store";
const useImage = imageStore();
const props = defineProps({
  data: Object,
});

let mark = 0;

const quill = ref();

const setContent = () => {
  quill.value.setContents(props.data.content);
};

watch(props.data, (newContent) => {
  setContent();
});

onUpdated(() => {
  if (mark == 0 && props.data.content) {
    setContent();
    mark = 1;
  }
});
</script>

<style></style>
