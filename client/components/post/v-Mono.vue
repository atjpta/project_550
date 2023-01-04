<template>
  <div>
    <div class="bg-base-200 rounded-2xl my-5 p-5">
      <div>
        <!-- phần đầu -->
        <div class="flex justify-between">
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
                  <i>{{ data.createdAt }}</i>
                </div>
              </div>
            </div>
          </nuxtLink>

          <!-- edit cho tác giả -->
          <!-- <div v-if="useAuth.user.id == data.author._id" class="pt-5"> -->
          <!-- <div>
            <div class="space-x-2 static flex">
              <nuxtLink to="/user/1">
                <div class="btn btn-outline btn-primary">
                  <OtherVIcon icon="fa-solid fa-pen-to-square" />
                </div>
              </nuxtLink>
              <div @click="openDialogDelete()" class="btn btn-outline btn-error">
                <OtherVIcon icon="fa-solid fa-trash-can" />
              </div>
            </div>
          </div> -->

          <!-- phần tùy chọn cho người đọc -->
          <!-- v-if="useAuth.user.id != data.author._id" -->
          <div class="dropdown dropdown-end z-10">
            <label tabindex="0" class="btn btn-outline btn-primary">
              <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
            </label>
            <ul
              tabindex="0"
              class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li class="hover-bordered">
                <a>
                  <div @click="openDialogReport()">
                    <OtherVIcon icon="fa-solid fa-flag" />
                    báo cáo bài viết
                  </div>
                </a>
              </li>
              <li class="hover-bordered">
                <a>
                  <div @click="openDialogReport()">
                    <OtherVIcon icon="fa-solid fa-bookmark" />
                    Lưu bài viết
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <!-- ảnh bìa và tiêu đề -->
        <nuxt-link :to="'/post/' + data.id">
          <div class="hover:scale-105 duration-500">
            <img class="rounded-2xl my-2 mx-auto" :src="data.image_cover_url" alt="" />
            <div class="font-bold text-4xl">{{ data.title }}</div>
          </div>
        </nuxt-link>
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
        <!-- các trạng thái của bài viết  -->
        <div class="flex justify-around mt-2 text-2xl">
          <div>
            <OtherVIcon icon="fa-solid fa-caret-down" />
            0
            <OtherVIcon icon="fa-solid fa-caret-up" />
          </div>
          <div>
            <OtherVIcon icon="fa-solid fa-comments" />
            0
          </div>
          <div>
            <OtherVIcon icon="fa-solid fa-eye" />
            0
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
});
</script>

<style></style>
