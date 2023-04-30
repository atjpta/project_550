<template>
  <div class="mt-5">
    <!-- loadingSkeleton -->

    <div v-if="loadingSkeleton" class="space-y-5">
      <div v-for="i in size" :key="i">
        <AdminVSkeleton />
      </div>
    </div>
    <div v-else>
      <div class="mt-5" v-if="dataPerPage[0]">
        <div v-for="(i, n) in dataPerPage" :key="i._id">
          <QuestionVMonoD :data="i" />
          <div v-if="n < useQuestion.list.length - 1" class="divider my-0"></div>
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">Không có câu hỏi nào !?</div>
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
            Trang {{ i }}
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
import { questionStore } from "~/stores/question.store";

const loadingSkeleton = ref(false);
const useRouteS = routeStore();
const useQuestion = questionStore();
const useAuth = authStore();
const route = useRoute();
const size = 9;
const maxPage = computed(() => {
  selectPage.value = 1;
  return Math.ceil(useQuestion.list.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
  let list = [];
  let index = size * (selectPage.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < useQuestion.list.length) list.push(useQuestion.list[index]);
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
    await useQuestion.findByOther(route.params.id);
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
