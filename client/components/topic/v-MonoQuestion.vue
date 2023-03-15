<template>
  <div>
    <transition name="bounce">
      <div
        :class="data.choice.length ? 'border-success' : 'border-info'"
        class="bg-base-200 rounded-2xl p-5 border-2"
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

            <!-- edit cho tác giả -->
            <div v-if="isAuthor">
              <div class="space-x-2 static flex">
                <div v-if="data.topic" class="tooltip" data-tip="xóa khỏi Topic">
                  <div
                    @click="openDialogRemoveTopic()"
                    class="btn btn-outline btn-warning"
                  >
                    <OtherVIcon icon="fa-solid fa-xmark" />
                  </div>
                </div>
                <div v-if="!data.topic" class="tooltip" data-tip="thêm vào topic">
                  <div @click="openDialogAddTopic()" class="btn btn-outline btn-success">
                    <OtherVIcon icon="fa-solid fa-plus" />
                  </div>
                </div>
                <nuxtLink
                  :to="`/question/edit/${data._id}`"
                  class="tooltip"
                  data-tip="sửa câu hỏi"
                >
                  <div class="btn btn-outline btn-primary">
                    <OtherVIcon icon="fa-solid fa-pen-to-square" />
                  </div>
                </nuxtLink>
                <div class="tooltip" data-tip="xóa câu hỏi">
                  <div @click="openDialogDelete()" class="btn btn-outline btn-error">
                    <OtherVIcon icon="fa-solid fa-trash-can" />
                  </div>
                </div>
              </div>
            </div>

            <!-- phần tùy chọn cho người đọc -->
            <div
              v-if="!isAuthor && useAuth.isUserLoggedIn"
              class="dropdown dropdown-end z-10"
            >
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
                      báo cáo câu hỏi
                    </div>
                  </a>
                </li>
                <li class="hover-bordered">
                  <a>
                    <div @click="openDialogReport()">
                      <OtherVIcon icon="fa-solid fa-bookmark" />
                      Lưu câu hỏi
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <!-- ảnh bìa và tiêu đề -->
          <div @click="goReadPost()" class="cursor-pointer">
            <div class="hover:text-info duration-500">
              <img class="rounded-2xl my-2 mx-auto" :src="data.image_cover_url" alt="" />
              <div class="font-bold text-4xl">{{ data.title }}</div>
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
          <!-- các trạng thái của câu hỏi  -->
          <div class="flex justify-around mt-2">
            <div class="tooltip" data-tip="điểm câu hỏi">
              <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
              {{ valVote }}
            </div>
            <div class="tooltip" data-tip="lượt trả lời">
              <OtherVIcon
                :class-icon="data.choice.length > 0 ? 'text-success' : ''"
                :icon="
                  data.choice.length > 0 ? 'fa-solid fa-check' : 'fa-solid fa-question'
                "
              />
              {{ data.answer.length > 0 ? data.answer[0].count : "0" }}
            </div>
            <div class="tooltip" data-tip="lượt bình luận">
              <OtherVIcon class-icon="text-primary" icon="fa-solid fa-comments" />
              {{ data.comment.length > 0 ? data.comment[0].count : "0" }}
            </div>
            <div class="tooltip" data-tip="lượt xem">
              <OtherVIcon class-icon="text-info" icon="fa-solid fa-eye" />
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
import { notificationStore } from "~~/stores/notification.store";
import { questionStore } from "~~/stores/question.store";
import { topicStore } from "~~/stores/topic.store";

const props = defineProps({
  data: Object,
});
const useNotification = notificationStore();
const useDialog = dialogStore();
const useAuth = authStore();
const useQuestion = questionStore();
const useTopic = topicStore();
const route = useRoute();
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
        content: "bạn chắc chắn muốn xóa câu hỏi?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        await useQuestion.deleteOne(props.data._id);
        await useQuestion.findAll();
      }
    );
  }
}
function openDialogRemoveTopic() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn xóa câu hỏi khỏi Topic này?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        await useQuestion.updateTopic(props.data._id);
        resetData();
      }
    );
  }
}

function openDialogAddTopic() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn thêm câu hỏi vào Topic này?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        const data = {
          topic: route.params.id,
        };
        const dataNotification = {
          author: useAuth.user.id,
          model: route.params.id,
          content: `bạn có câu hỏi mới trong chủ đề "${useTopic.topic.name}"`,
          url: route.fullPath,
          type: "info",
        };
        if (useTopic.topic.team.length > 0) {
          data.team = useTopic.topic.team[0]._id;
        }
        await useQuestion.updateTopic(props.data._id, data);
        await useNotification.create(dataNotification);
        resetData();
      }
    );
  }
}

async function resetData() {
  await useQuestion.findByTopic(route.params.id);
  await useQuestion.findByNoTopic(useAuth.user.id);
  await useTopic.findOne(route.params.id);
}

async function goReadPost() {
  await useQuestion.update({
    id: props.data._id,
    view: props.data.view + 1,
  });
  navigateTo(`/question/${props.data._id}`);
}
</script>
