<template>
  <div>
    <transition name="bounce">
      <div
        :class="
          data.choice.length
            ? 'bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-pink-500/0'
            : 'bg-gradient-to-r from-warning/10 via-warning/5 to-pink-500/0'
        "
        class="rounded-2xl p-5 hover:bg-gradient-to-l"
      >
        <div>
          <!-- phần đầu -->
          <div class="flex justify-between">
            <nuxtLink
              class="hover:text-sky-500 hover:scale-110 duration-500"
              :to="`/user/${data?.author[0]?._id}/overview`"
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

            <!-- phần tùy chọn cho người đọc -->
            <div v-if="!isAuthor" class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-primary">
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
                      Báo cáo
                    </div>
                  </a>
                </li>
                <li class="hover-bordered">
                  <a>
                    <div @click="openDialogRemoveSave(removeSave)">
                      <OtherVIcon icon="fa-solid fa-x" />
                      Bỏ Lưu
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- ảnh bìa và tiêu đề -->
          <div @click="goReadPost()" class="cursor-pointer">
            <div class="hover:text-info">
              <img
                class="rounded-2xl my-2 mx-auto"
                :src="data.question[0].image_cover_url"
                alt=""
              />
              <div class="font-bold text-4xl">{{ data.question[0].title }}</div>
            </div>
          </div>
          <!-- tag -->
          <div class="mt-4 flex">
            <div v-for="i in data.tag" :key="i._id" class="">
              <nuxt-link
                :to="`/tag/${i._id}/post`"
                class="btn btn-outline btn-sm mr-1 mt-1"
                >{{ "#" + i.name }}</nuxt-link
              >
            </div>
          </div>
          <!-- các trạng thái của bài viết  -->
          <div class="flex space-x-5 mt-2">
            <div class="tooltip" data-tip="Điểm câu hỏi">
              <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
              {{ valVote }}
            </div>
            <div class="tooltip" data-tip="Lượt trả lời">
              <OtherVIcon
                :class-icon="data.choice.length > 0 ? 'text-success' : ''"
                :icon="
                  data.choice.length > 0 ? 'fa-solid fa-check' : 'fa-solid fa-question'
                "
              />
              {{ data.answer.length > 0 ? data.answer[0].count : "0" }}
            </div>
            <div class="tooltip" data-tip="Lượt bình luận">
              <OtherVIcon class-icon="text-primary" icon="fa-solid fa-comments" />
              {{ data.comment.length > 0 ? data.comment[0].count : "0" }}
            </div>
            <div class="tooltip" data-tip="Lượt xem">
              <div>
                <OtherVIcon class-icon="text-info" icon="fa-solid fa-eye" />
                {{ data.question[0].view }}
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
import { followStore } from "~~/stores/follow.store";
import { questionStore } from "~~/stores/question.store";
import { routeStore } from "~~/stores/route.store";

const useDialog = dialogStore();
const useAuth = authStore();
const useQuestion = questionStore();
const useRouteS = routeStore();
const useFollow = followStore();

const props = defineProps({
  data: Object,
});

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

async function goReadPost() {
  if (useAuth.user && useAuth.user.id == props.data.author[0]._id) {
  } else {
    await useQuestion.update({
      id: props.data.question[0]._id,
      view: props.data.question[0].view + 1,
    });
  }
  navigateTo(`/question/${props.data.question[0]._id}`);
}

const removeSave = async () => {
  try {
    await useFollow.deleteOne(props.data._id);
    await useRouteS.refreshData();
  } catch (error) {
    console.log(erorr);
    console.log("lỗi save");
  }
};

function openDialogRemoveSave(cb) {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "Bạn chắc chắn muốn xóa bài viết khỏi danh sách lưu trữ",
      btn1: "Ok",
      btn2: "Hủy",
    },
    () => {
      cb();
    }
  );
}
</script>
