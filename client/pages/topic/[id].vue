<template>
  <div>
    <PostVSkeleton v-if="loadingSkeleton" />

    <div v-else>
      <div class="rounded-2xl">
        <TopicVTopic :data="useTopic.topic" />
      </div>
      <div class="divider"></div>

      <div class="flex justify-center uppercase text-3xl font-bold mt-5">
        Danh sách câu hỏi
        <div
          data-tip="Các câu hỏi riêng tư sẽ không hiện "
          class="flex tooltip tooltip-left lg:tooltip-top btn-xs btn btn-outline btn-info rounded-full h-1 w-6 mt-2 ml-2"
        >
          <OtherVIcon class-icon="" icon="fa-solid fa-info" />
        </div>
      </div>

      <!-- các btn -->
      <div class="flex justify-end my-3 lg:flex">
        <div>
          <div
            @click="navigateTo(`/question/topic/${route.params.id}`)"
            class="btn btn-success btn-sm mt-1 lg:mt-0"
          >
            {{ "Tạo thêm câu hỏi vào Topic" }}
          </div>
        </div>
      </div>

      <div class="mb-5 space-y-5" v-if="dataPerPage[0]">
        <div v-for="(i, n) in dataPerPage" :key="n">
          <TopicVMonoQuestion :data="i" />
        </div>
      </div>

      <!-- btn chuyển trang -->

      <div v-if="dataPerPage[0]" class="form-control mx-auto w-fit my-3">
        <div class="input-group lg:input-group-md input-group-sm">
          <button
            @click="goToPre()"
            :disabled="selectPage == 1"
            class="btn lg:btn-md btn-sm"
          >
            <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-left" />
          </button>
          <select
            v-model="selectPage"
            @change="goToPage()"
            class="select select-bordered lg:select-md select-sm"
          >
            <option :value="i" :disabled="i == selectPage" v-for="i in maxPage" :key="i">
              Trang {{ i }}
            </option>
          </select>
          <button
            @click="goToNext()"
            :disabled="selectPage == maxPage"
            class="btn btn-sm lg:btn-md text-2xl"
          >
            <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-right" />
          </button>
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

const size = 9;
const maxPage = computed(() => {
  selectPage.value = 1;
  return Math.ceil(useQuestion.list.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
  let list = [];
  let index = size * (selectPage.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < useQuestion.list.length) {
      list.push(useQuestion.list[index]);
    }
    index++;
  }
  return list;
});

function goToPre() {
  selectPage.value -= 1;
}

function goToNext() {
  selectPage.value += 1;
}

function openDialogSignin(cb) {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn cần đăng nhập để dùng chức năng",
        btn1: "Đăng nhập",
        btn2: "Hủy",
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

const title = computed(() => {
  return useTopic.topic.name;
});

useHead({
  title: title,
});
</script>

<style></style>
