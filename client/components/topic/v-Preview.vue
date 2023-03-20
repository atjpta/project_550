<template>
  <div>
    <transition name="bounce">
      <div class="">
        <div class="mb-3">
          <div
            class="glass rounded-2xl ring-0 p-2 my-2 lg:flex justify-between sticky top-14"
          >
            <div class="w-fit">
              <div class="hover:text-sky-500 hover:scale-110 duration-500" to="/user/1">
                <!-- tác giả -->
                <div class="flex">
                  <div class="avatar">
                    <div class="w-12 h-12 rounded-full">
                      <img :src="data.author?.avatar_url" />
                    </div>
                  </div>
                  <div class="text-2xl mx-3">
                    {{ data.author?.name }}
                  </div>
                </div>
              </div>
            </div>
            <!-- các btn -->
            <div class="flex mt-1 space-x-3">
              <div class="btn-disabled btn-sm lg:btn-md btn btn-outline btn-square">
                <OtherVIcon class-icon="text-xl" icon="fa-solid fa-bookmark" />
              </div>
              <div class="btn-sm lg:btn-md btn btn-ghost">
                <OtherVIcon
                  class-icon="text-xl mr-1 text-warning"
                  icon="fa-solid fa-star"
                />
                <div class="text-2xl">0</div>
              </div>
              <div class="btn-sm lg:btn-md btn btn-ghost">
                <OtherVIcon
                  class-icon="text-xl mr-1 text-info"
                  icon="fa-solid fa-file-lines"
                />
                <div class="text-2xl">0</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex">
          <!-- ảnh team -->
          <div class="mx-auto min-w-max w-32 min-h-max h-32 mr-3">
            <img
              class="rounded-2xl w-32 h-32"
              :src="useImage.previewImage || data.image_cover_url"
              alt=""
            />
          </div>
          <div class="w-full">
            <div class="flex justify-between">
              <div>
                <!-- tên team -->
                <div class="text-2xl font-bold uppercase">
                  {{ data.name }}
                </div>
              </div>
            </div>
            <!-- giới thiệu -->
            <div class="text-xl">{{ data.introduce }}</div>
            <!-- tag -->
            <div class="mt-4">
              <div v-for="i in 3" :key="i" class="btn btn-outline btn-sm mr-1 mt-1">
                {{ "#test" }}
              </div>
            </div>
          </div>
        </div>
        <!-- phần team -->
        <div v-if="data.team.name" class="mt-5">
          <div class="text-2xl font-semibold">Nhóm</div>
          <div class="btn btn-ghost justify-start">{{ data.team.name }}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { dialogStore } from "~~/stores/dialog.store";
import { imageStore } from "~~/stores/image.store";
import { postStore } from "~~/stores/post.store";
const useImage = imageStore();
const props = defineProps({
  data: Object,
});
</script>
