<template>
  <div>
    <transition name="bounce">
      <div class="bg-base-200 rounded-2xl my-5 p-5">
        <div>
          <!-- phần đầu -->
          <div class="flex justify-between">
            <nuxtLink
              class="hover:text-sky-500 hover:scale-110 duration-500"
              to="/user/1"
            >
              <!-- tác giả -->
              <div class="flex">
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full">
                    <img :src="data.author[0].avatar_url" />
                  </div>
                </div>
                <div class="text-2xl mx-3">
                  {{ data.author[0].name }}
                  <div class="text-sm italic">
                    <i>{{ data.createdAt }}</i>
                  </div>
                </div>
              </div>
            </nuxtLink>

            <!-- edit cho tác giả -->
            <div v-if="isAuthor">
              <div class="space-x-2 static flex">
                <nuxtLink :to="`/post/edit/${data.id}`">
                  <div class="btn btn-outline btn-primary">
                    <OtherVIcon icon="fa-solid fa-pen-to-square" />
                  </div>
                </nuxtLink>
                <div @click="openDialogDelete()" class="btn btn-outline btn-error">
                  <OtherVIcon icon="fa-solid fa-trash-can" />
                </div>
              </div>
            </div>

            <!-- phần tùy chọn cho người đọc -->
            <div v-if="!isAuthor" class="dropdown dropdown-end z-10">
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
          <div @click="goReadPost()" class="cursor-pointer">
            <div class="hover:scale-105 duration-500">
              <img class="rounded-2xl my-2 mx-auto" :src="data.image_cover_url" alt="" />
              <div class="font-bold text-4xl">{{ data.title }}</div>
            </div>
          </div>
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
              {{ valVote }}
              <OtherVIcon icon="fa-solid fa-caret-up" />
            </div>
            <div>
              <OtherVIcon icon="fa-solid fa-comments" />
              {{ data.comment.length > 0 ? data.comment[0].count : "0" }}
            </div>
            <div>
              <OtherVIcon icon="fa-solid fa-eye" />
              {{ data.view }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { dialogStore } from "~~/stores/dialog.store";
import { postStore } from "~~/stores/post.store";

const props = defineProps({
  data: Object,
});

const useDialog = dialogStore();
const useAuth = authStore();
const usePost = postStore();

const isAuthor = computed(() => {
  if (useAuth.user && props.data.author) {
    return useAuth.user.id == props.data.author[0]._id;
  }
});

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

function openDialogDelete() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn xóa bài viết?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        await usePost.deleteOne(props.data._id);
        await usePost.findAll();
      }
    );
  }
}

async function goReadPost() {
  await usePost.update({
    id: props.data._id,
    view: props.data.view + 1,
  });
  navigateTo(`/post/${props.data._id}`);
}
</script>
