<template>
  <div>
    <PostVSkeleton v-if="loadingSkeleton" />

    <div v-else>
      <div class="rounded-2xl">
        <TopicVTopic :data="useTopic.topic" />
      </div>
      <div class="divider"></div>

      <div class="flex justify-center uppercase text-3xl font-bold mt-5">
        danh sách câu hỏi
        <div
          data-tip="các Câu hỏi riêng tư sẽ không hiện "
          class="flex tooltip tooltip-left lg:tooltip-top btn-xs btn btn-outline btn-info rounded-full h-1 w-6 mt-2 ml-2"
        >
          <OtherVIcon class-icon="" icon="fa-solid fa-info" />
        </div>
      </div>

      <!-- các btn -->
      <div class="justify-between my-3 lg:flex">
        <div>
          <div
            @click="openDialogSignin(addTopic)"
            class="btn btn-outline btn-success btn-sm lg:btn-md mt-1 lg:mt-0"
          >
            {{ isTopic ? "hiện danh sách" : "thêm câu hỏi vào Topic" }}
          </div>
          <div v-if="!isTopic">
            <div
              @click="
                openDialogSignin(() => navigateTo(`/question/topic/${route.params.id}`))
              "
              class="btn btn-ghost btn-xs italic lowercase"
            >
              tạo câu hỏi mới?
            </div>
          </div>
        </div>
      </div>
      <div v-if="listPost.length == 0" class="text-center text-xl">
        <div>chưa có câu hỏi nào hết !!!</div>
        <div
          v-if="isTopic"
          @click="
            openDialogSignin(() => navigateTo(`/question/topic/${route.params.id}`))
          "
          class="btn btn-ghost italic lowercase"
        >
          tạo câu hỏi mới?
        </div>
      </div>

      <div class="space-y-5">
        <div v-for="i in listPost" :key="i.id">
          <TopicVMonoQuestion :data="i" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { authStore } from "~~/stores/auth.store";
import { topicStore } from "~~/stores/topic.store";
import { questionStore } from "~~/stores/question.store";
import { teamStore } from "~~/stores/team.store";
import { alertStore } from "~~/stores/alert.store";

const loadingSkeleton = ref(false);
const useAlert = alertStore();
const route = useRoute();
const useTopic = topicStore();
const useQuestion = questionStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();
const useTeam = teamStore();

const loading = ref(false);
const isTopic = ref(false);

const listPost = computed(() => {
  if (isTopic.value) {
    return useQuestion.listNoTopic;
  } else return useQuestion.list;
});
function openDialogSignin(cb) {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để dùng chức năng",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = `/topic/${route.params.id}`;
      }
    );
  } else {
    cb();
  }
}

const addTopic = () => {
  if (useTopic.topic.team.length > 0) {
    let mark = false;
    useTeam.List_team_ByUser.forEach((e) => {
      if (e._id == useTopic.topic.team[0]._id) {
        mark = true;
      }
    });
    if (mark) {
      isTopic.value = !isTopic.value;
    } else
      useAlert.setError(
        `bạn không thuộc vào nhóm ${useTopic.topic.team[0].name}. Bạn hãy gia nhập nhóm và thử lại sau`
      );
  } else {
    isTopic.value = !isTopic.value;
  }
};

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useTopic.findOne(route.params.id);
    await useQuestion.findByTopic(route.params.id);
    if (useAuth.user) {
      await useQuestion.findByNoTopic(useAuth.user.id);
      await useTeam.findByUser(useAuth.user.id);
    }
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
