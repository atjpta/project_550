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
                <img :src="data.author?.avatar_url" />
              </div>
            </div>
            <div class="text-2xl mx-3">
              {{ data.author?.name }}
              <div class="text-sm italic">vừa xong</div>
            </div>
          </div>
        </nuxtLink>
      </div>
      <!-- các btn -->
      <div class="flex justify-evenly">
        <div class="flex justify-evenly mr-2">
          <div
            v-if="loading != 'up'"
            @click="openDialogSignin(up)"
            :class="classUp"
            class="btn-sm lg:btn-md btn btn-circle btn-outline"
          >
            <OtherVIcon class-icon="text-3xl" icon="fa-solid fa-caret-up" />
          </div>
          <div
            v-if="loading == 'up'"
            class="btn-sm lg:btn-md btn btn-circle btn-outline loading"
          ></div>

          <div class="btn-sm lg:btn-md btn btn-circle btn-ghost no-animation">
            <div class="text-2xl">{{ valVote }}</div>
          </div>
          <div
            v-if="loading != 'down'"
            @click="openDialogSignin(down)"
            :class="classDown"
            class="btn-sm lg:btn-md btn btn-circle btn-outline"
          >
            <OtherVIcon class-icon="text-3xl" icon="fa-solid fa-caret-down" />
          </div>
          <div
            v-if="loading == 'down'"
            class="btn-sm lg:btn-md btn btn-circle btn-outline loading"
          ></div>
        </div>
        <div
          @click="save()"
          :class="classSave"
          class="btn-sm lg:btn-md btn btn-outline btn-square"
        >
          <OtherVIcon class-icon="text-xl" icon="fa-solid fa-bookmark" />
        </div>
        <a href="#comment" class="btn-sm lg:btn-md btn btn-ghost">
          <OtherVIcon
            class-icon="text-xl mr-1 text-primary"
            icon="fa-solid fa-comments"
          />
          <div class="text-2xl">
            {{ data.comment && data.comment.length > 0 ? data.comment[0].count : "0" }}
          </div>
        </a>
        <div class="btn-sm lg:btn-md btn btn-ghost">
          <OtherVIcon class-icon="text-xl mr-1 text-info" icon="fa-solid fa-eye" />
          <div class="text-2xl">
            {{ data.view }}
          </div>
        </div>
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
      <div v-if="Object.keys(data.series).length != 0" class="mt-5">
        <div class="text-2xl font-semibold">Series</div>
        <div class="btn btn-ghost justify-start">{{ data.series.name }}</div>
      </div>
      <!-- phần team -->
      <div v-if="Object.keys(data.team).length != 0" class="mt-5">
        <div class="text-2xl font-semibold">Nhóm</div>
        <div class="btn btn-ghost justify-start">{{ data.team.name }}</div>
      </div>
    </div>

    <div class="divider"></div>

    <div id="comment" class="text-2xl font-semibold mb-2">
      Nhập bình luận
      <div class="tooltip" data-tip="gõ @ để tag tên">
        <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
          <OtherVIcon class-icon="" icon="fa-solid fa-info" />
        </div>
      </div>
    </div>
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
const useImage = imageStore();
const useAuth = authStore();
const useVote = voteStore();
const usePost = postStore();
const useRoute = routeStore();
const useDialog = dialogStore();
const props = defineProps({
  data: Object,
  change: Object,
});

const loading = ref("");

const valVote = computed(() => {
  return 0;
});

const classUp = computed(() => {
  return "btn-disabled";
});

const classDown = computed(() => {
  return "btn-disabled";
});

const classSave = computed(() => {
  return "btn-disabled";
});

let mark = 0;

const quill = ref();

const setContent = () => {
  quill.value.setContents(props.data.content);
};

function test() {
  console.log("test");
}

watch(props, (newContent) => {
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
