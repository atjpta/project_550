<template>
  <div>
    <div
      class="bg-gradient-to-r from-info/10 via-info/5 to-pink-500/5 rounded-2xl border-b-4 border-info p-5"
    >
      <span
        class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block"
      >
        <span class="relative text-white text-3xl font-black px-5">Thẻ tag</span>
      </span>
      <div class="text-xl indent-8 mt-3">
        Các bài viết, câu hỏi, sẽ được gắn các hash tag để có thể tìm thấy 1 cách nhanh
        chóng
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

    <!-- loadingSkeleton -->

    <div
      v-if="loadingSkeleton"
      class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <div v-for="i in 7" :key="i._id">
        <TagVSkeleton />
      </div>
    </div>
    <div v-else class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="i in useTag.List_tag" :key="i._id">
        <TagVMono :data="i" />
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
import { tagStore } from "~~/stores/tag.store";
import { searchStore } from "~~/stores/search.store";

const useTag = tagStore();
const route = useRoute();
const loadingSkeleton = ref(false);

const useSearch = searchStore();
const selectPage = ref(1);
const size = 3;
const maxPage = computed(() => {
  return Math.ceil(useSearch.list_tag.length / size);
});

function goToPage() {
  getApiNext(selectPage.value);
}

function goToPre() {
  selectPage.value -= 1;
  getApiNext(parseInt(selectPage.value));
}

function goToNext() {
  selectPage.value += 1;
  getApiNext(parseInt(selectPage.value));
}

async function getApiNext(page) {
  loadingSkeleton.value = true;
  try {
    await useTag.findAllInfoPage(page, size);
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useTag.findAllInfoPage(1, size);
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
