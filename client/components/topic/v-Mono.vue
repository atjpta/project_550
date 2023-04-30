<template>
  <div>
    <transition name="bounce">
      <div
        class="indicator w-full hover:bg-gradient-to-l bg-gradient-to-r from-pink-500/10 via-pink-500/5 to-pink-500/0 rounded-md p-5">
        <div class="flex">
          <div>
            <!-- ảnh series -->
            <NuxtLink :to="`/topic/${data._id}`"
              class="mx-auto min-w-max w-32 min-h-max h-32 mr-3 overflow-hidden rounded-2xl">
              <img class="rounded-2xl w-32 h-32 hover:scale-110 duration-500" :src="data.image_cover_url" alt="" />
            </NuxtLink>
            <!-- các trạng thái của team  -->
            <div class="flex space-x-5 mt-2">
              <div class="tooltip" data-tip="Điểm topic">
                <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
                {{ data.valScore }}
              </div>
              <div class="tooltip" data-tip="Số câu hỏi">
                <OtherVIcon class-icon="text-info" icon="fa-solid fa-file-circle-question" />
                {{ data.question[0]?.count || 0 }}
              </div>
            </div>
          </div>
          <div class="ml-5">
            <div class="">
              <div>
                <div class="flex justify-end space-x-2">
                  <div v-if="isEditT" class="tooltip" data-tip="Xóa topic ra khỏi nhóm">
                    <div @click="openDialogRemoveTeam()" class="btn btn-ghost">
                      <OtherVIcon class-icon="text-warning text-xl" icon="fa-solid fa-x" />
                    </div>
                  </div>
                  <!-- phần tùy chọn cho người đọc -->
                  <div class="dropdown dropdown-left flex justify-end indicator-item mt-10 mr-10">
                    <label tabindex="0" class="btn btn-ghost">
                      <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
                    </label>
                    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      <div v-if="!isAuthor">
                        <li @click="openDialogReport()" class="hover-bordered">
                          <a>
                            <div>
                              <OtherVIcxon icon="fa-solid fa-flag" />
                              Báo cáo
                            </div>
                          </a>
                        </li>
                      </div>
                      <div v-if="isAuthor">
                        <li @click="navigateTo(`/topic/edit/${data._id}`)" class="hover-bordered">
                          <a>
                            <div>
                              <OtherVIcon class-icon="text-primary" icon="fa-solid fa-pen-to-square" />
                              Sửa
                            </div>
                          </a>
                        </li>
                        <li @click="openDialogDelete()" class="hover-bordered">
                          <a>
                            <div>
                              <OtherVIcon class-icon="text-error" icon="fa-solid fa-trash-can" />
                              Xóa
                            </div>
                          </a>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
                <nuxtLink class="hover:text-sky-500 hover:scale-110 duration-500" :to="`/topic/${data._id}`">
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
                <nuxt-link :to="`/tag/${i._id}/post`" class="btn btn-ghost bg-base-100/50 btn-sm mr-1 mt-1">{{ "#" +
                  i.name }}</nuxt-link>
              </div>
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
import { reportStore } from "~~/stores/report.store";
import { routeStore } from "~~/stores/route.store";
import { topicStore } from "~~/stores/topic.store";

const props = defineProps({
  data: Object,
  isEditT: Boolean,
});
const useReport = reportStore();
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
        content: "Bạn chắc chắn muốn xóa chủ đề này?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        await useTopic.deleteOne(props.data._id);
        useRouteS.refreshData();
      }
    );
  }
}

function openDialogRemoveTeam() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content:
          "Bạn chắc chắn muốn xóa chủ đề này ra khỏi nhóm? Tất cả câu hỏi trong chủ đề này sẽ không còn trong nhóm này nữa",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        await useTopic.update({
          id: props.data._id,
          team: " ",
        });
        await useRouteS.refreshData();
      }
    );
  }
}
function openDialogReport() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialogInput(
      {
        title: "Thông báo cực căng!",
        content: "Chủ đề này có vấn để?!",
        btn1: "Gửi",
        btn2: "Hủy",
      },
      async (input) => {
        await useReport.create({
          author: useAuth.user.id,
          content: input,
          model: props.data._id,
        });
      }
    );
  } else {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn cần đăng nhập để tạo bài viết",
        btn1: "Đăng nhập",
        btn2: "Hủy",
      },
      () => {
        useRouteS.redirectedFrom = useRoute().fullPath;
        return navigateTo("/auth/signin");
      }
    );
  }
}
</script>
