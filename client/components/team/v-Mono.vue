<template>
  <div>
    <transition name="bounce">
      <div class="bg-base-200 rounded-2xl my-5 p-5">
        <div class="flex">
          <!-- ảnh team -->
          <div class="mx-auto min-w-max w-32 min-h-max h-32 mr-3">
            <img class="rounded-2xl w-32 h-32" :src="data.image_cover_url" alt="" />
          </div>
          <div class="w-full">
            <div class="flex justify-between">
              <div>
                <nuxtLink
                  class="hover:text-sky-500 hover:scale-110 duration-500"
                  to="/team/1"
                >
                  <!-- tên team -->
                  <div class="text-2xl font-bold uppercase">
                    {{ data.name }}
                  </div>
                </nuxtLink>
              </div>

              <!-- phần tùy chọn cho người đọc -->
              <div v-if="useAuth.isUserLoggedIn" class="dropdown dropdown-end z-10">
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
                        báo cáo Nhóm
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
          <div>
            <OtherVIcon icon="fa-solid fa-star" />
            0
          </div>
          <div>
            <OtherVIcon icon="fa-solid fa-file-lines" />
            0
          </div>
          <div>
            <OtherVIcon icon="fa-solid fa-layer-group" />
            0
          </div>
          <div>
            <OtherVIcon icon="fa-solid fa-file-circle-question" />
            0
          </div>
          <div>
            <OtherVIcon icon="fa-solid fa-layer-group" />
            0
          </div>
          <div>
            <OtherVIcon icon="fa-solid fa-users-line" />
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
import { postStore } from "~~/stores/post.store";

const props = defineProps({
  data: Object,
});

const useDialog = dialogStore();
const useAuth = authStore();
const usePost = postStore();

const valVote = computed(() => {
  if (props.data.vote) {
    let val = props.data.vote?.val;
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
