<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="flex flex-wrap">
        <nuxtLink
          :to="i.url"
          v-for="i in datafilter"
          :key="i"
          :class="i.filter == route.params.filter ? 'bg-primary text-white' : ''"
          class="mr-1 mb-1 btn btn-outline btn-sm lg:btn-md"
        >
          {{ i.name }}
        </nuxtLink>
      </div>
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md"
      >
        tạo câu hỏi
      </button>
    </div>
    <!-- btn chuyển trang -->

    <div class="form-control mx-auto w-fit mt-3">
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
            trang {{ i }}
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
    <!-- QuestionVSkeleton -->
    <div class="mt-5 space-y-5" v-if="loadingSkeleton">
      <div v-for="i in 9" :key="i">
        <QuestionVSkeleton />
      </div>
    </div>
    <div v-else class="mt-5 space-y-5">
      <div v-for="i in useQuestion.list" :key="i.id">
        <QuestionVMono :data="i" />
      </div>
    </div>

    <!-- btn chuyển trang -->

    <div class="form-control mx-auto w-fit mt-3">
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
            trang {{ i }}
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
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { questionStore } from "~~/stores/question.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "~~/stores/dialog.store";
import { searchStore } from "~~/stores/search.store";

const useQuestion = questionStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const loadingSkeleton = ref(false);
const route = useRoute();
const useSearch = searchStore();
const selectPage = ref(route.params.page);
const size = 3;
const maxPage = computed(() => {
  return Math.ceil(useSearch.list_question.length / size);
});
const datafilter = ref([
  {
    name: "mới nhất",
    url: "/question/new/1",
    filter: "new",
  },
  {
    name: "điểm cao nhất",
    url: "/question/vote/1",
    filter: "vote",
  },
  {
    name: "xem nhiều nhất",
    url: "/question/view/1",
    filter: "view",
  },
  {
    name: "chưa trả lời",
    url: "/question/unreply/1",
    filter: "unreply",
  },
]);

function goToPage() {
  navigateTo(`/question/${route.params.filter}/${selectPage.value}`);
}

function goToPre() {
  navigateTo(`/question/${route.params.filter}/${parseInt(selectPage.value) - 1}`);
}

function goToNext() {
  navigateTo(`/question/${route.params.filter}/${parseInt(selectPage.value) + 1}`);
}

function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để tạo câu hỏi",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = "/question/edit";
      }
    );
  } else {
    navigateTo("/question/edit");
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    useQuestion.list = await useQuestion.findPerFilter(
      route.params.filter,
      route.params.page,
      size
    );
    if (useQuestion.list.length == 0) {
      navigateTo(`/question/${route.params.filter}/1`);
    }
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  useRouteS.cb = getApi;
  getApi();
});

onUnmounted(() => {
  useQuestion.list = [];
});
</script>

<style></style>
