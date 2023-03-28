<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-end">
      <button
        @click="openDialogSignin()"
        class="btn btn-outline btn-success btn-sm lg:btn-md"
      >
        tạo series mới
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

    <div v-if="loadingSkeleton" class="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in 7" :key="i.id">
        <SeriesVSkeleton />
      </div>
    </div>
    <div v-else class="grid lg:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in useSeries.List_series" :key="i.id">
        <SeriesVMono :data="i" />
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
import { routeStore } from "~~/stores/route.store";
import { seriesStore } from "~~/stores/series.store";
import { dialogStore } from "~~/stores/dialog.store";
import { searchStore } from "~~/stores/search.store";

const useSeries = seriesStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const loadingSkeleton = ref(false);

const route = useRoute();
const useSearch = searchStore();
const selectPage = ref(route.params.page);
const size = 3;
const maxPage = computed(() => {
  return Math.ceil(useSearch.list_series.length / size);
});

function goToPage() {
  navigateTo(`/series/${route.params.filter}/${selectPage.value}`);
}

function goToPre() {
  navigateTo(`/series/${route.params.filter}/${parseInt(selectPage.value) - 1}`);
}

function goToNext() {
  navigateTo(`/series/${route.params.filter}/${parseInt(selectPage.value) + 1}`);
}

const datafilter = ref([
  {
    name: "mới nhất",
    url: "/series/new/0",
    filter: "new",
  },
  {
    name: "điểm cao nhất",
    url: "/series/score/0",
    filter: "vote",
  },
]);

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
        useRouteS.redirectedFrom = "/series/edit";
      }
    );
  } else {
    navigateTo("/series/edit");
  }
}

async function getApi() {
  loadingSkeleton.value = true;

  try {
    useSeries.List_series = await useSeries.findPerFilter(
      "vote",
      route.params.page,
      size
    );
    if (useSeries.List_series.length == 0) {
      navigateTo(`/series/${route.params.filter}/1`);
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
</script>

<style></style>
