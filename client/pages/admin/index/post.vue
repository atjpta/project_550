<template>
  <div class="my-5">
    <!-- tiêu đề -->
    <div class="flex justify-between text-xl font-black uppercase mb-2">
      <div class="basis-1/3">tác giả</div>
      <div>tiêu đề</div>
      <div class="basis-1/3"></div>
    </div>
    <!-- loadingSkeleton -->

    <div v-if="loadingSkeleton" class="space-y-5 my-5">
      <div v-for="i in size" :key="i">
        <AdminVSkeleton />
      </div>
    </div>
    <div v-else>
      <div class="space-y-5 my-5" v-if="dataPerPage[0]">
        <div v-for="(i, n) in dataPerPage" :key="i._id">
          <AdminVMonoPost :data="i" />

          <div v-if="n <
            (useReport.list_search_post.length > size
              ? size
              : useReport.list_search_post.length) -
            1
            " class="divider"></div>
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">không có bài viết nào cả !?</div>
      </div>
    </div>
    <!-- btn chuyển trang -->

    <div v-if="dataPerPage[0]" class="form-control mx-auto w-fit">
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
import { routeStore } from "~~/stores/route.store";
import { reportStore } from "~~/stores/report.store";

const loadingSkeleton = ref(false);
const useRouteS = routeStore();
const useReport = reportStore();
const size = 5;
const maxPage = computed(() => {
  selectPage.value = 1;
  return Math.ceil(useReport.list_search_post.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
  let list = [];
  let index = size * (selectPage.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < useReport.list_search_post.length)
      list.push(useReport.list_search_post[index]);
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

async function getApi() {
  loadingSkeleton.value = true;
  try {
    useReport.getPost();
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  useRouteS.cb = getApi;
});
</script>

<style></style>
