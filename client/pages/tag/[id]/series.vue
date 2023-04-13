<template>
  <div class="mt-5">
    <!-- btn chuyển trang -->
    <div class="form-control mx-auto w-fit my-3">
      <div class="input-group lg:input-group-md input-group-sm">
        <button @click="goToPre()" :disabled="selectPage == 1" class="btn lg:btn-md btn-sm">
          <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-left" />
        </button>
        <select v-model="selectPage" class="select select-bordered lg:select-md select-sm">
          <option :value="i" :disabled="i == selectPage" v-for="i in maxPage" :key="i">
            trang {{ i }}
          </option>
        </select>
        <button @click="goToNext()" :disabled="selectPage == maxPage" class="btn btn-sm lg:btn-md text-2xl">
          <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-right" />
        </button>
      </div>
    </div>

    <!-- loadingSkeleton -->

    <div v-if="loadingSkeleton" class="space-y-5">
      <div v-for="i in size" :key="i">
        <AdminVSkeleton />
      </div>
    </div>
    <div v-else>
      <div class="space-y-3 mt-5" v-if="dataPerPage[0]">
        <div v-for="i in dataPerPage" :key="i._id">
          <SeriesVMono :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">
          chưa chuỗi bài viết có tag #{{ useTag.tag.name }} nào cả!!!
        </div>
      </div>
    </div>
    <!-- btn chuyển trang -->

    <div class="form-control mx-auto w-fit my-3">
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
import { authStore } from "~/stores/auth.store";
import { seriesStore } from "~/stores/series.store";
import { tagStore } from "~/stores/tag.store";

const loadingSkeleton = ref(false);
const useRouteS = routeStore();
const useSeries = seriesStore();
const useAuth = authStore();
const useTag = tagStore();
const route = useRoute();
const size = 5;
const maxPage = computed(() => {
  selectPage.value = 1;
  return Math.ceil(useSeries.List_series.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
  let list = [];
  let index = size * (selectPage.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < useSeries.List_series.length) list.push(useSeries.List_series[index]);
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
  await useSeries.findByTag(route.params.id);
}

onMounted(() => {
  useRouteS.cb = getApi;
});
</script>

<style></style>
