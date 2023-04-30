<template>
  <div class="">
    <!-- loadingSkeleton -->

    <div v-if="loadingSkeleton" class="space-y-5 my-5">
      <div v-for="i in size" :key="i">
        <AdminVSkeleton />
      </div>
    </div>
    <div v-else>
      <div class="space-y-5 my-5" v-if="dataPerPage[0]">
        <div v-for="(i, n) in dataPerPage" :key="i._id">
          <TeamVMono :data="i" />
          <div v-if="n < useTeam.List_team.length - 1" class="divider my-0"></div>
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">
          Chưa nhóm có tag #{{ useTag.tag.name }} nào cả!!!
        </div>
      </div>
    </div>
    <!-- btn chuyển trang -->

    <div class="form-control mx-auto w-fit">
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
import { tagStore } from "~/stores/tag.store";
import { teamStore } from "~/stores/team.store";
import { roleStore } from "~/stores/role.store";

const loadingSkeleton = ref(false);
const useRouteS = routeStore();
const useAuth = authStore();
const useTag = tagStore();
const useTeam = teamStore();
const useRole = roleStore();
const route = useRoute();
const size = 9;
const maxPage = computed(() => {
  selectPage.value = 1;
  return Math.ceil(useTeam.List_team.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
  let list = [];
  let index = size * (selectPage.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < useTeam.List_team.length) list.push(useTeam.List_team[index]);
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
  await useRole.findAll();
  await useTeam.findByTag(route.params.id);
}
onMounted(() => {
  useRouteS.cb = getApi;
});
</script>

<style></style>
