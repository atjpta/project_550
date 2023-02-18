<template>
  <div>
    <transition name="bounce">
      <div class="bg-base-200 rounded-2xl">
        <div class="mb-3">
          <div
            class="glass z-10 rounded-2xl p-2 my-2 lg:flex justify-between shadow-md sticky top-3"
          >
            <div class="w-fit">
              <nuxtLink
                class="hover:text-sky-500 hover:scale-110 duration-500"
                to="/user/1"
              >
                <!-- tác giả -->
                <div class="flex">
                  <div class="avatar">
                    <div class="w-12 h-12 rounded-full">
                      <img :src="author?.avatar_url" />
                    </div>
                  </div>
                  <div class="text-2xl mx-3">
                    {{ author?.name }}
                  </div>
                </div>
              </nuxtLink>
            </div>
            <!-- các btn -->
            <div class="flex justify-evenly">
              <div class="tooltip" data-tip="điểm series">
                <div class="btn-sm lg:btn-md btn btn-ghost">
                  <OtherVIcon
                    class-icon="text-xl mr-1 text-warning"
                    icon="fa-solid fa-star"
                  />
                  <div class="text-2xl">{{ data.valScore }}</div>
                </div>
              </div>
              <div class="tooltip" data-tip="điểm series">
                <div class="btn-sm lg:btn-md btn btn-ghost">
                  <OtherVIcon
                    class-icon="text-xl mr-1 text-info"
                    icon="fa-solid fa-file-lines"
                  />
                  <div class="text-2xl">{{ valPost }}</div>
                </div>
              </div>

              <div class="btn-disabled btn-sm lg:btn-md btn btn-outline btn-square">
                <OtherVIcon class-icon="text-xl" icon="fa-solid fa-bookmark" />
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
            <div class="mt-4 flex">
              <div v-for="i in list_tag" :key="i._id" class="">
                <nuxt-link
                  :to="`/tag/${i._id}/post`"
                  class="btn btn-outline btn-sm mr-1 mt-1"
                  >{{ "#" + i.name }}</nuxt-link
                >
              </div>
            </div>
          </div>
        </div>
        <!-- phần team -->
        <div v-if="data.team && data.team[0]?.name" class="mt-5">
          <div class="text-2xl font-semibold">Nhóm</div>
          <div class="btn btn-ghost justify-start">{{ data.team[0].name }}</div>
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

const list_tag = computed(() => {
  let list = [];
  if (props.data.listtag?.length > 0) {
    props.data.listtag.forEach((e) => {
      e.forEach((ee) => {
        check(list, ee);
      });
    });
  }
  return list;
});

function check(list, tag) {
  let mark = 0;
  list.forEach((e) => {
    if (e._id == tag._id) {
      mark = 1;
      return;
    }
  });
  if (mark == 0) {
    list.push(tag);
  }
}

const author = computed(() => {
  if (props.data.author) {
    return props.data.author[0];
  }
  return null;
});

const valPost = computed(() => {
  if (props.data.post && props.data.post.length > 0) {
    return props.data.post[0].count;
  }
  return 0;
});
</script>
