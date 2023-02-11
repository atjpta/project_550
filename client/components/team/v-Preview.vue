<template>
  <div>
    <transition name="bounce">
      <div class="bg-base-200 rounded-2xl p-5">
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
            <!-- ảnh bìa và tiêu đề -->
            <div class="text-xl">{{ data.introduce }}</div>
            <!-- tag -->
            <div class="mt-4">
              <div
                v-for="i in data.tag"
                :key="i._id"
                class="btn btn-outline btn-sm mr-1 mt-1"
              >
                {{ "#" + i.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- các trạng thái của team  -->
        <div class="flex justify-around mt-2">
          <div class="tooltip" data-tip="điểm nhóm">
            <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
            0
          </div>
          <div class="tooltip" data-tip="số lượng thành viên">
            <OtherVIcon class-icon="text-info" icon="fa-solid fa-users-line" />
            0
          </div>
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
