<template>
  <div>
    <span
      class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
      <span class="relative text-white text-3xl font-black px-5">Nhóm</span>
    </span>
    <!-- các nut lọc -->
    <div class="flex justify-end">
      <button @click="openDialogSignin()" class="btn  btn-success btn-sm">
        Tạo Nhóm mới
      </button>
    </div>

    <!-- loadingSkeleton -->
    <div v-if="loadingSkeleton" class="grid lg:grid-cols-2 grid-cols-1 gap-5 my-5">
      <div v-for="i in 7" :key="i">
        <TeamVSkeleton />
      </div>
    </div>
    <div v-else class="grid lg:grid-cols-2 grid-cols-1 gap-5 my-5">
      <div v-for="i in useTeam.List_team" :key="i.id">
        <TeamVMono :data="i" />
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
import { authStore } from "~~/stores/auth.store";
import { teamStore } from "~~/stores/team.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "../../stores/dialog.store";
import { roleStore } from "~~/stores/role.store";
import { searchStore } from "~~/stores/search.store";

const loadingSkeleton = ref(false);
const useTeam = teamStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const useRole = roleStore();

const route = useRoute();
const useSearch = searchStore();
const selectPage = ref(1);
const size = 9;
const maxPage = computed(() => {
  return Math.ceil(useSearch.list_team.length / size);
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

function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn cần đăng nhập để tạo nhóm mới",
        btn1: "Đăng nhập",
        btn2: "Hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = "/team/edit";
      }
    );
  } else {
    navigateTo("/team/edit");
  }
}

async function getApiNext(page) {
  loadingSkeleton.value = true;
  try {
    await useTeam.findAllPage(page, size);
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

const getApi = async () => {
  if (useSearch.mark.Team != 1) {
    await useSearch.getTeam();
    useSearch.mark.Team = 1;
  }
  loadingSkeleton.value = true;
  try {
    await useRole.findAll();
    await useTeam.findAllPage(1, size);

    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  useRouteS.cb = getApi;
  getApi();
});

useHead({
  title: "Nhóm",
});
</script>

<style></style>
