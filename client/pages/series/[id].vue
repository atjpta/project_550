<template>
  <div>
    <div class="p-5 bg-base-200 rounded-2xl">
      <SeriesVSeries :data="useSeries.series" />
    </div>
    <div class="text-center uppercase text-3xl font-bold mt-5">
      danh sách các bài viết
    </div>

    <!-- các btn -->
    <div class="justify-between my-3 lg:flex">
      <div class="space-x-1">
        <div v-for="i in 3" :key="i" class="btn btn-primary btn-outline btn-sm lg:btn-md">
          {{ i }} 0000
        </div>
      </div>
      <div>
        <button
          v-if="
            useAuth.isUserLoggedIn &&
            useSeries.series.author &&
            useAuth.user?.id == useSeries.series.author[0]?._id
          "
          @click="isSeries = !isSeries"
          class="btn btn-outline btn-success btn-sm lg:btn-md mt-1 lg:mt-0"
        >
          {{ isSeries ? "hiện danh sách" : "thêm bài viết vào series" }}
        </button>
        <div
          v-if="
            !isSeries &&
            useAuth.isUserLoggedIn &&
            useSeries.series.author &&
            useAuth.user?.id == useSeries.series.author[0]?._id
          "
        >
          <nuxt-link :to="`/post/series/${route.params.id}`">
            <div class="btn btn-ghost btn-xs italic lowercase">tạo bài viết mới?</div>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div v-if="listPost.length == 0" class="text-center text-xl">
      chưa có bài viết nào hết !!!
    </div>
    <div v-for="i in listPost" :key="i.id">
      <SeriesVMonoPost :data="i" />
    </div>
  </div>
</template>

<script setup>
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { authStore } from "~~/stores/auth.store";
import { seriesStore } from "~~/stores/series.store";
import { postStore } from "~~/stores/post.store";

const route = useRoute();
const useSeries = seriesStore();
const usePost = postStore();
const useRouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();

const loading = ref(false);
const isSeries = ref(false);

const listPost = computed(() => {
  if (isSeries.value) {
    return usePost.listNoSeries;
  } else return usePost.list;
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
        useRouteS.redirectedFrom = `/post/${route.params.id}`;
      }
    );
  } else {
    cb();
  }
}

async function getApi() {
  await useSeries.findOne(route.params.id);
  await usePost.findBySeries(route.params.id);
  await usePost.findByNoSeries(useAuth.user.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
