<template>
  <div class="">
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
      class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5"
    >
      <div v-for="i in 7" :key="i">
        <UserVSkeleton />
      </div>
    </div>
    <div v-else class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-5">
      <div v-for="i in useUser.list_user" :key="i">
        <UserVMono :data="i" />
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
import { userStore } from "~~/stores/user.store";
import { searchStore } from "~~/stores/search.store";

const route = useRoute();
const useSearch = searchStore();
const selectPage = ref(1);
const size = 2;
const maxPage = computed(() => {
  return Math.ceil(useSearch.list_user.length / size);
});

const loadingSkeleton = ref(false);
const useUser = userStore();

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
    await useUser.findAllOverViewPage(page, size);
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useUser.findAllOverViewPage(1, size);
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
