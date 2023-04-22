<template>
  <div class="">
    <!-- các nut lọc -->
    <span
      class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
      <span class="relative text-white text-3xl font-black px-5">Chủ đề</span>
    </span>
    <div class="flex justify-end">
      <button @click="openDialogSignin()" class="btn btn-outline btn-success btn-sm">
        tạo chủ đề mới
      </button>
    </div>

    <!-- topicVSkeleton -->
    <div v-if="loadingSkeleton" class="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in 7" :key="i.id">
        <TopicVSkeleton :data="i" />
      </div>
    </div>
    <div v-else class="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in useTopic.List_topic" :key="i.id">
        <TopicVMono :data="i" />
      </div>
    </div>
    <!-- btn chuyển trang -->

    <div class="form-control mx-auto w-fit mt-3">
      <div class="input-group lg:input-group-md input-group-sm">
        <button @click="goToPre()" :disabled="selectPage == 1" class="btn lg:btn-md btn-sm">
          <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-left" />
        </button>
        <select v-model="selectPage" @change="goToPage()" class="select select-bordered lg:select-md select-sm">
          <option :value="i" :disabled="i == selectPage" v-for="i in maxPage" :key="i">
            trang {{ i }}
          </option>
        </select>
        <button @click="goToNext()" :disabled="selectPage == maxPage" class="btn btn-sm lg:btn-md text-2xl">
          <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { routeStore } from "~~/stores/route.store";
import { topicStore } from "~~/stores/topic.store";
import { dialogStore } from "~~/stores/dialog.store";
import { searchStore } from "~~/stores/search.store";

const route = useRoute();
const useSearch = searchStore();
const selectPage = ref(route.params.page);
const size = 9;
const maxPage = computed(() => {
  return Math.ceil(useSearch.list_topic.length / size);
});

const loadingSkeleton = ref(false);
const useTopic = topicStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();

const datafilter = ref([
  {
    name: "mới nhất",
    url: "/topic/new/0",
  },
  {
    name: "điểm cao nhất",
    url: "/topic/score/0",
  },
]);

function goToPage() {
  navigateTo(`/topic/${route.params.filter}/${selectPage.value}`);
}

function goToPre() {
  navigateTo(`/topic/${route.params.filter}/${parseInt(selectPage.value) - 1}`);
}

function goToNext() {
  navigateTo(`/topic/${route.params.filter}/${parseInt(selectPage.value) + 1}`);
}

function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để tạo nhóm mới",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = "/topic/edit";
      }
    );
  } else {
    navigateTo("/topic/edit");
  }
}

async function getApi() {
  loadingSkeleton.value = true;

  if (useSearch.mark.Topic != 1) {
    await useSearch.getTopic();
    useSearch.mark.Topic = 1;
  }
  try {
    useTopic.reset();
    // await useTopic.findAll();
    useTopic.List_topic = await useTopic.findPerFilter("vote", route.params.page, size);
    if (useTopic.List_topic.length == 0) {
      loadingSkeleton.value = false;

      return navigateTo(`/topic/${route.params.filter}/1`);
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

useHead({
  title: "chủ đề",
});
</script>

<style></style>
