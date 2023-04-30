<template>
  <div class="mt-5">
    <!-- btn chuyển trang -->
    <div class="flex justify-end">
      <button @click="openDialogSignin()" class="btn  btn-success btn-sm mb-5">
        Tạo bài viết
      </button>
    </div>

    <!-- loadingSkeleton -->

    <div v-if="loadingSkeleton" class="space-y-5">
      <div v-for="i in size" :key="i">
        <AdminVSkeleton />
      </div>
    </div>
    <div v-else>
      <div class="space-y-3" v-if="dataPerPage[0]">
        <div v-for="i in dataPerPage" :key="i._id">
          <PostVMono :data="i" />
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">Không có bài viết nào !?</div>
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
import { postStore } from "~/stores/post.store";
import { teamStore } from "~/stores/team.store";
import { dialogStore } from "~~/stores/dialog.store";

const loadingSkeleton = ref(false);
const useRouteS = routeStore();
const usePost = postStore();
const useDialog = dialogStore();
const useAuth = authStore();
const route = useRoute();
const useTeam = teamStore();
const size = 9;
const maxPage = computed(() => {
  selectPage.value = 1;
  return Math.ceil(usePost.list.length / size);
});
const selectPage = ref(1);

const dataPerPage = computed(() => {
  let list = [];
  let index = size * (selectPage.value - 1);

  for (let i = 0; i < size; i++) {
    if (index < usePost.list.length) list.push(usePost.list[index]);
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

function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn cần đăng nhập để tạo bài viết",
        btn1: "Đăng nhập",
        btn2: "Hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = `/post/team/${useTeam.team[0]._id}`;
      }
    );
  } else {
    navigateTo(`/post/team/${useTeam.team[0]._id}`);
  }
}

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await usePost.findByTeam(route.params.id);
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
