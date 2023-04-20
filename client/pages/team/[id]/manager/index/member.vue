<template>
  <div class="mt-5">
    <!-- loadingSkeleton -->

    <div v-if="loadingSkeleton" class="space-y-5">
      <div v-for="i in size" :key="i">
        <AdminVSkeleton />
      </div>
    </div>
    <div v-else>
      <div class="space-y-3 mt-5" v-if="dataPerPage[0]">
        <div v-for="i in dataPerPage" :key="i.id">
          <MemberVMono :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">không có câu hỏi nào !?</div>
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
import { alertStore } from "~/stores/alert.store";
import { memberStore } from "~~/stores/member.store";
const loadingSkeleton = ref(false);
const useAlert = alertStore();
const route = useRoute();
const useMember = memberStore();
const size = 5;
const maxPage = computed(() => {
  selectPage.value = 1;
  return Math.ceil(useMember.List_member.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
  let list = [];
  let index = size * (selectPage.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < useMember.List_member.length) list.push(useMember.List_member[index]);
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
  if (!useMember.isEditT) {
    useAlert.setWarning("bạn không có quyền truy cập");
    return navigateTo(`/`);
  }
  loadingSkeleton.value = true;
  try {
    await useMember.findByTeam(route.params.id);

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
