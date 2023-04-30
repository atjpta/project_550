<template>
  <div class="">
    <span
      class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block"
    >
      <span class="relative text-white text-3xl font-black px-5">Tìm kiếm</span>
    </span>
    <!-- <SearchVInput /> -->
    <div class="form-control mt-3">
      <div class="input-group">
        <input
          v-model="useSearch.key"
          type="text"
          placeholder="Tìm kiếm…"
          class="input input-bordered w-1/2"
        />
        <button @click="getApi()" class="btn btn-square">
          <OtherVIcon icon="fa-solid fa-magnifying-glass" />
        </button>
      </div>
    </div>
    <div class="tabs mt-3">
      <div v-for="i in menuDashboard" :key="i">
        <nuxtLink
          :to="'/search' + i.url"
          :class="'/search' + i.url == route.path ? 'tab-active' : ''"
          class="tab tab-bordered uppercase font-medium indicator"
        >
          <div>
            {{ i.title }}
            <div
              v-show="i?.sl > 0"
              class="indicator-item badge badge-secondary border-0 mr-2"
            >
              {{ i?.sl }}
            </div>
          </div>
        </nuxtLink>
      </div>
    </div>
    <div class="space-y-5 mt-5" v-if="loadingSkeleton">
      <div v-for="item in 7" :key="item">
        <PostVSkeleton />
      </div>
    </div>
    <NuxtPage v-else />
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { searchStore } from "~~/stores/search.store";
import { userStore } from "~~/stores/user.store";

const useUser = userStore();
const useAuth = authStore();
const route = useRoute();
const useSearch = searchStore();
const loadingSkeleton = ref(false);
const menuDashboard = ref([
  {
    title: "Môn học",
    url: "/course",
    sl: computed(() => {
      return useSearch.list_search_course.length;
    }),
  },
  {
    title: "Bài viết",
    url: "/post",
    sl: computed(() => {
      return useSearch.list_search_post.length;
    }),
  },
  {
    title: "Chuỗi bài viết",
    url: "/series",
    sl: computed(() => {
      return useSearch.list_search_series.length;
    }),
  },
  {
    title: "Câu hỏi",
    url: "/question",
    sl: computed(() => {
      return useSearch.list_search_question.length;
    }),
  },
  {
    title: "Chủ đề",
    url: "/topic",
    sl: computed(() => {
      return useSearch.list_search_topic.length;
    }),
  },
  {
    title: "Người dùng",
    url: "/user",
    sl: computed(() => {
      return useSearch.list_search_user.length;
    }),
  },
  {
    title: "Nhóm",
    url: "/team",
    sl: computed(() => {
      return useSearch.list_search_team.length;
    }),
  },
  {
    title: "Thẻ tag",
    url: "/tag",
    sl: computed(() => {
      return useSearch.list_search_tag.length;
    }),
  },
]);

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useSearch.getApi();
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  // useSearch.key = useSearch.keySave;
  getApi();
  if (route.path == "/search") {
    navigateTo("/search/course");
  }
});

onUnmounted(() => {
  // useSearch.keySave = useSearch.key;
  // useSearch.key = "";
});

useHead({
  title: "Tìm kiếm",
});
</script>

<style></style>
