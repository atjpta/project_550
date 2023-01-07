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
            <div class="btn-sm btn-circle btn btn-outline">
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
    <div class="w-4/5 mx-auto">
      <div class="btn btn-ghost btn-xs italic lowercase">hiện 3 bình luận con</div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";

const props = defineProps({
  data: Object,
});
</script>

<style></style>
