<template>
  <div class="">
    <span
      class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
      <span class="relative text-white text-3xl font-black px-5">Tìm kiếm</span>
    </span>
    <!-- <SearchVInput /> -->
    <div class="form-control mt-3">
      <div class="input-group">
        <input v-model="useSearch.key" type="text" placeholder="Tìm kiếm…" class="input input-bordered w-1/2" />
        <button @click="getApi()" class="btn btn-square">
          <OtherVIcon icon="fa-solid fa-magnifying-glass" />
        </button>
      </div>
    </div>
    <div class="flex flex-wrap mt-3">
      <div v-for="i in menuDashboard" :key="i">
        <nuxtLink :to="'/search' + i.url" class="btn btn-sm btn-outline mr-1 mb-1 indicator">
          <div>
            {{ i.title }}
            <div v-show="i?.sl > 0" class="indicator-item badge badge-secondary border-0 mr-2">
              {{ i?.sl }}
            </div>
          </div>
        </nuxtLink>
      </div>
    </div>
    <div class="space-y-5 mt-5" v-if="!useSearch.list_post[0]">
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
    title: "bài viết",
    url: "/post",
    sl: computed(() => {
      return useSearch.list_search_post.length;
    }),
  },
  {
    title: "series",
    url: "/series",
    sl: computed(() => {
      return useSearch.list_search_series.length;
    }),
  },
  {
    title: "câu hỏi",
    url: "/question",
    sl: computed(() => {
      return useSearch.list_search_question.length;
    }),
  },
  {
    title: "Topic",
    url: "/topic",
    sl: computed(() => {
      return useSearch.list_search_topic.length;
    }),
  },
  {
    title: "người dùng",
    url: "/user",
    sl: computed(() => {
      return useSearch.list_search_user.length;
    }),
  },
  {
    title: "nhóm",
    url: "/team",
    sl: computed(() => {
      return useSearch.list_search_team.length;
    }),
  },
  {
    title: "thẻ tag",
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
  useSearch.key = useSearch.keySave;
  getApi();
  if (route.path == "/search") {
    navigateTo("/search/post");
  }
});

onUnmounted(() => {
  useSearch.keySave = useSearch.key;
  useSearch.key = "";
});
</script>

<style></style>
