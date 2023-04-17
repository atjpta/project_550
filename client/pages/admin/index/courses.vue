<template>
  <div class="my-5">
    <div class="flex justify-end">
      <nuxtLink to="/admin/course/edit" class="btn btn-success btn-outline btn-sm">tạo môn học</nuxtLink>
    </div>
    <!-- loadingSkeleton -->

    <div v-if="loadingSkeleton" class="space-y-5">
      <div v-for="i in size" :key="i">
        <AdminVSkeleton />
      </div>
    </div>
    <div v-else>
      <div class="space-y-3 mt-5" v-if="useCourse.list[0]">
        <div v-for="(i, n) in useCourse.list" :key="i._id">
          <AdminVMonoCourse :data="i" />
          <div v-if="n < useCourse.list.length - 1" class="divider"></div>
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">Bạn chưa có môn học nào cả !?</div>
      </div>
    </div>
    <!-- btn chuyển trang -->

    <div v-if="useCourse.list[0]" class="form-control mx-auto w-fit my-3">
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
import { courseStore } from "~/stores/course.store";

const loadingSkeleton = ref(false);
const useRouteS = routeStore();
const useCourse = courseStore();

const size = 5;
const maxPage = computed(() => {
  let max = 0;
  max = Math.ceil(useCourse.maxLength / size);
  return max;
});
const selectPage = ref(1);

async function goToPre() {
  selectPage.value -= 1;
  await getApiPage(selectPage.value);
}

async function goToNext() {
  selectPage.value += 1;
  await getApiPage(selectPage.value);
}

async function goToPage() {
  await getApiPage(selectPage.value);
}

async function getApiPage(page) {
  loadingSkeleton.value = true;
  try {
    await useCourse.findPerPage(page, size);

    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

async function getApi(page) {
  loadingSkeleton.value = true;
  try {
    if (page) {
      selectPage.value = page;
    }
    await useCourse.findPerPage(page ?? selectPage.value, size);
    await useCourse.getMaxLength();
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  useRouteS.cb = getApi;
  getApi(1);
});
</script>

<style></style>
