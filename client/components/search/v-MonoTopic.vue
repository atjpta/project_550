<template>
  <div>
    <transition name="bounce">
      <div
        class="bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-pink-500/0 rounded-2xl p-5"
      >
        <div class="flex">
          <!-- ảnh series -->
          <NuxtLink
            :to="`/topic/${data._id}`"
            class="mx-auto min-w-max w-32 min-h-max h-32 mr-3 overflow-hidden rounded-2xl"
          >
            <img
              class="rounded-2xl w-32 h-32 hover:scale-110 duration-500"
              :src="data.image_cover_url"
              alt=""
            />
          </NuxtLink>
          <div class="w-full">
            <div class="">
              <div>
                <!-- phần tùy chọn cho người đọc -->
                <div
                  v-if="!isAuthor && useAuth.isUserLoggedIn"
                  class="dropdown dropdown-end flex justify-end"
                >
                  <label tabindex="0" class="flex justify-end">
                    <div class="btn btn-ghost">
                      <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
                    </div>
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
                <!-- edit cho tác giả -->
                <div v-if="isAuthor">
                  <div class="space-x-2 flex justify-end">
                    <nuxtLink
                      :to="`/topic/edit/${data._id}`"
                      class="tooltip"
                      data-tip="sửa topic"
                    >
                      <div class="btn btn-ghost text-primary">
                        <OtherVIcon icon="fa-solid fa-pen-to-square" />
                      </div>
                    </nuxtLink>

                    <div class="tooltip" data-tip="xóa topic">
                      <div @click="openDialogDelete()" class="btn btn-ghost text-error">
                        <OtherVIcon icon="fa-solid fa-trash-can" />
                      </div>
                    </div>
                  </div>
                </div>
                <nuxtLink
                  class="hover:text-sky-500 hover:scale-110 duration-500"
                  :to="`/topic/${data._id}`"
                >
                  <!-- tên topic -->
                  <div class="text-2xl font-bold uppercase">
                    {{ data.name }}
                  </div>
                </nuxtLink>
              </div>
            </div>

            <!-- tag -->
            <div class="mt-4 flex flex-wrap">
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

        <!-- các trạng thái của team  -->
        <div class="flex space-x-5 mt-2">
          <div class="tooltip" data-tip="điểm topic">
            <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
            {{ data.valScore }}
          </div>
          <div class="tooltip" data-tip="số câu hỏi">
            <OtherVIcon class-icon="text-info" icon="fa-solid fa-file-circle-question" />
            {{ data.question[0]?.count || 0 }}
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
import { routeStore } from "~~/stores/route.store";
import { topicStore } from "~~/stores/topic.store";

const props = defineProps({
  data: Object,
});

const useDialog = dialogStore();
const useAuth = authStore();
const usePost = postStore();
const useTopic = topicStore();
const useRouteS = routeStore();
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

const isAuthor = computed(() => {
  if (useAuth.user && props.data.author) {
    return useAuth.user.id == props.data.author[0]._id;
  }
});

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
        content: "bạn chắc chắn muốn xóa Topic này?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        await useTopic.deleteOne(props.data._id);
        useRouteS.refreshData();
      }
    );
  }
}
</script>
