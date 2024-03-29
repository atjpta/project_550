<template>
  <div>
    <transition name="bounce">
      <div :class="data.choice.length
        ? 'bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-pink-500/0'
        : 'bg-gradient-to-r from-warning/10 via-warning/5 to-pink-500/0'
        " class="rounded-2xl p-5 hover:bg-gradient-to-l">
        <div>
          <!-- phần đầu -->
          <div class="flex justify-between">
            <nuxtLink class="hover:text-sky-500 hover:scale-110 duration-500"
              :to="`/user/${data?.author[0]?._id}/overview`">
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
            <div class="dropdown dropdown-end z-10 flex justify-end">
              <label tabindex="0" class="btn btn-ghost">
                <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
              </label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <div v-if="!isAuthor">
                  <li @click="openDialogReport()" class="hover-bordered">
                    <a>
                      <div>
                        <OtherVIcon icon="fa-solid fa-flag" />
                        Báo cáo
                      </div>
                    </a>
                  </li>
                </div>
                <div v-if="isAuthor">
                  <!-- <li v-if="data.topic" @click="openDialogRemoveTopic()" class="hover-bordered">
                    <a>
                      <div>
                        <OtherVIcon class-icon="text-warning" icon="fa-solid fa-xmark" />
                        xóa khỏi chủ đề
                      </div>
                    </a>
                  </li>
                  <li v-if="!data.topic" @click="openDialogAddTopic()" class="hover-bordered">
                    <a>
                      <div>
                        <OtherVIcon class-icon="text-success" icon="fa-solid fa-plus" />
                        thêm vào chủ đề
                      </div>
                    </a>
                  </li> -->
                  <li @click="navigateTo(`/question/edit/${data._id}`)" class="hover-bordered">
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
              <nuxt-link :to="`/tag/${i._id}/post`" class="btn btn-ghost bg-base-100/50 btn-sm mr-1 mt-1">{{ "#" + i.name
              }}</nuxt-link>
            </div>
          </div>
          <!-- các trạng thái của câu hỏi  -->
          <div class="flex space-x-5 mt-2">
            <div class="tooltip" data-tip="Điểm câu hỏi">
              <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
              {{ valVote }}
            </div>
            <div class="tooltip" data-tip="Lượt trả lời">
              <OtherVIcon :class-icon="data.choice.length > 0 ? 'text-success' : ''" :icon="data.choice.length > 0 ? 'fa-solid fa-check' : 'fa-solid fa-question'
                " />
              {{ data.answer.length > 0 ? data.answer[0].count : "0" }}
            </div>
            <div class="tooltip" data-tip="Lượt bình luận">
              <OtherVIcon class-icon="text-primary" icon="fa-solid fa-comments" />
              {{ data.comment.length > 0 ? data.comment[0].count : "0" }}
            </div>
            <div class="tooltip" data-tip="Lượt xem">
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
import { reportStore } from "~~/stores/report.store";
import { topicStore } from "~~/stores/topic.store";

const props = defineProps({
  data: Object,
});
const useReport = reportStore();

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
        content: "Bạn chắc chắn muốn xóa câu hỏi?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        await useQuestion.deleteOne(props.data._id);
        resetData();
      }
    );
  }
}
// function openDialogRemoveTopic() {
//   if (useAuth.isUserLoggedIn) {
//     useDialog.showDialog(
//       {
//         title: "Thông báo cực căng!",
//         content: "bạn chắc chắn muốn xóa câu hỏi khỏi Topic này?",
//         btn1: "ok",
//         btn2: "hủy",
//       },
//       async () => {
//         await useQuestion.updateTopic(props.data._id);
//         resetData();
//       }
//     );
//   }
// }

// function openDialogAddTopic() {
//   if (useAuth.isUserLoggedIn) {
//     useDialog.showDialog(
//       {
//         title: "Thông báo cực căng!",
//         content: "bạn chắc chắn muốn thêm câu hỏi vào Topic này?",
//         btn1: "ok",
//         btn2: "hủy",
//       },
//       async () => {
//         const data = {
//           topic: route.params.id,
//         };
//         const dataNotification = {
//           author: useAuth.user.id,
//           model: route.params.id,
//           content: `bạn có câu hỏi mới trong chủ đề "${useTopic.topic.name}"`,
//           url: route.fullPath,
//           type: "info",
//         };
//         await useQuestion.updateTopic(props.data._id, data);
//         await useNotification.create(dataNotification);
//         resetData();
//       }
//     );
//   }
// }

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
function openDialogReport() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialogInput(
      {
        title: "Thông báo cực căng!",
        content: "Câu hỏi này có vấn để?!",
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
  }
}
</script>
