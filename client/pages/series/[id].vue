<template>
  <div>
    <PostVSkeleton v-if="loadingSkeleton" />
    <div v-else>
      <div class="rounded-2xl">
        <SeriesVSeries :data="useSeries.series" />
      </div>

      <div class="divider"></div>
      <div class="flex justify-center uppercase text-3xl font-bold mt-5">
        danh sách bài viết
        <div data-tip="các bài viết riêng tư sẽ không hiện "
          class="flex tooltip tooltip-left lg:tooltip-top btn-xs btn btn-outline btn-info rounded-full h-1 w-6 mt-2 ml-2">
          <OtherVIcon class-icon="" icon="fa-solid fa-info" />
        </div>
      </div>

      <!-- các btn -->
      <div class="flex justify-end my-3 lg:flex">
        <div>
          <button v-if="useAuth.isUserLoggedIn &&
            useSeries.series.author &&
            useAuth.user?.id == useSeries.series.author[0]?._id
            " @click="navigateTo(`/post/series/${route.params.id}`)"
            class="btn btn-outline btn-success btn-sm mt-1 lg:mt-0">
            {{ "tạo thêm bài viết vào series" }}
          </button>
        </div>
      </div>

      <div class="mb-5 space-y-5" v-if="dataPerPage[0]">
        <div v-for="(i, n) in dataPerPage" :key="n">
          <SeriesVMonoPost :data="i" />
        </div>
      </div>

      <!-- btn chuyển trang -->

      <div v-if="dataPerPage[0]" class="form-control mx-auto w-fit my-3">
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
  </div>
</template>

<script setup>
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { authStore } from "~~/stores/auth.store";
import { seriesStore } from "~~/stores/series.store";
import { postStore } from "~~/stores/post.store";
import { alertStore } from "~~/stores/alert.store";
const useAlert = alertStore();
const route = useRoute();
const useSeries = seriesStore();
const usePost = postStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();
const loadingSkeleton = ref(false);
const loading = ref(false);
const size = 9;
const maxPage = computed(() => {
  selectPage.value = 1;
  return Math.ceil(usePost.list.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
  let list = [];
  let index = size * (selectPage.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < usePost.list.length) {
      list.push(usePost.list[index]);
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
        content: "bạn cần đăng nhập để dùng chức năng",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = `/post/${route.params.id}`;
      }
    );
  } else {
    cb();
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useSeries.findOne(route.params.id);
    if (useSeries.series.status == "private") {
      if (useSeries.series.author[0]._id != useAuth.user?.id) {
        useAlert.setWarning("bài viết riêng tư, bạn không thể vào được!!");
        return navigateTo("/");
      }
      if (!useAuth.user) {
        useAlert.setWarning("bài viết riêng tư, bạn không thể vào được!!");
        return navigateTo("/");
      }
    }
    await usePost.findBySeries(route.params.id);
    if (useAuth.user) {
      await usePost.findByNoSeries(useAuth.user.id);
      if (useSeries.series.team[0]) {
        await useMember.checkIsMember(useSeries.series.team[0]._id, useAuth.user.id);
      }
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
  return useSeries.series.name;
});

useHead({
  title: title,
});
</script>

<style></style>
