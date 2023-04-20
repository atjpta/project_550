<template>
  <div class="">
    <!-- <span
      class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
      <span class="relative text-white text-3xl font-black px-3   ">Bài viết</span>
    </span> -->
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="flex flex-wrap">
        <nuxtLink :to="i.url" v-for="i in datafilter" :key="i"
          :class="i.filter == route.params.filter ? ' router-link-active' : ''" class="mr-1 mb-1 btn btn-outline btn-sm">
          {{ i.name }}
        </nuxtLink>
      </div>
      <button @click="openDialogSignin()" class="btn btn-outline btn-success btn-sm">
        tạo bài viết
      </button>
    </div>

    <!-- PostVSkeleton -->
    <div v-if="loading">
      <div class="my-5 grid 2xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        <div v-for="item in 8" :key="item.id">
          <PostVSkeleton />
        </div>
      </div>
    </div>

    <div v-else>
      <div class="my-5 2xl:grid hidden grid-cols-3 space-x-3">
        <div class="space-y-3">
          <div v-for="i in posts.list31" :key="i.id">
            <PostVMono :data="i" />
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="i in posts.list32" :key="i.id">
            <PostVMono :data="i" />
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="i in posts.list33" :key="i.id">
            <PostVMono :data="i" />
          </div>
        </div>
      </div>

      <div class="my-5 md:grid 2xl:hidden hidden grid-cols-2 space-x-3">
        <div class="space-y-3">
          <div v-for="i in posts.list21" :key="i.id">
            <PostVMono :data="i" />
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="i in posts.list22" :key="i.id">
            <PostVMono :data="i" />
          </div>
        </div>
      </div>

      <div class="my-5 space-y-3 md:hidden">
        <div v-for="i in usePost.list" :key="i.id">
          <PostVMono :data="i" />
        </div>
      </div>
    </div>

    <!-- <div v-if="selectPage > maxPage" class="mx-auto w-fit">
      <nutxLink to="/" class="btn btn-outline btn-primary mx-auto"> trở lại </nutxLink>
    </div> -->
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
import { postStore } from "~~/stores/post.store";
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "~~/stores/dialog.store";
import { searchStore } from "~~/stores/search.store";

const usePost = postStore();
const useAuth = authStore();
const useDialog = dialogStore();
const useRouteS = routeStore();
const route = useRoute();
const loading = ref(false);
const posts = ref({});
const useSearch = searchStore();
const selectPage = ref(route.params.page);
const size = 9;
const maxPage = computed(() => {
  return Math.ceil(useSearch.list_post.length / size);
});

function goToPage() {
  navigateTo(`/post/${route.params.filter}/${selectPage.value}`);
}

function goToPre() {
  navigateTo(`/post/${route.params.filter}/${parseInt(selectPage.value) - 1}`);
}

function goToNext() {
  navigateTo(`/post/${route.params.filter}/${parseInt(selectPage.value) + 1}`);
}

const datafilter = ref([
  {
    name: "mới nhất",
    url: "/post/new/1",
    filter: "new",
  },
  {
    name: "điểm cao nhất",
    url: "/post/vote/1",
    filter: "vote",
  },
  {
    name: "xem nhiều nhất",
    url: "/post/view/1",
    filter: "view",
  },
]);

function formatList(list) {
  const listdata = {
    list31: [],
    list32: [],
    list33: [],
    list21: [],
    list22: [],
    list11: [],
  };
  list.forEach((e, i) => {
    if (i % 3 == 0) {
      listdata.list31.push(e);
    }
    if (i % 3 == 1) {
      listdata.list32.push(e);
    }
    if (i % 3 == 2) {
      listdata.list33.push(e);
    }
    if (i % 2 == 0) {
      listdata.list21.push(e);
    }
    if (i % 2 == 1) {
      listdata.list22.push(e);
    }
    listdata.list11.push(e);
  });
  return listdata;
}

function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để tạo bài viết",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        useRouteS.redirectedFrom = "/post/edit";
        return navigateTo("/auth/signin");
      }
    );
  } else {
    return navigateTo("/post/edit");
  }
}

async function getApi() {
  if (useSearch.mark.post != 1) {
    await useSearch.getPost();
    useSearch.mark.post = 1;
  }
  loading.value = true;
  try {
    usePost.list = await usePost.findPerFilter(
      route.params.filter,
      route.params.page,
      size
    );
    if (usePost.list.length == 0) {
      navigateTo(`/post/${route.params.filter}/1`);
    }
    posts.value = formatList(usePost.list);
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  useRouteS.cb = getApi;
  getApi();
});

onUnmounted(() => {
  usePost.list = [];
});

useHead({
  title: `bài viết`,
});
</script>

<style></style>
