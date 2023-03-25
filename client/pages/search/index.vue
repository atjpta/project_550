<template>
  <div>
    <div class="text-3xl font-bold uppercase mb-5">Tìm kiếm</div>
    <!-- <SearchVInput /> -->
    <div class="form-control">
      <div class="input-group">
        <input
          v-model="useSearch.key"
          type="text"
          placeholder="Tìm kiếm…"
          class="input input-bordered w-1/2"
        />
        <button class="btn btn-square">
          <OtherVIcon icon="fa-solid fa-magnifying-glass" />
        </button>
      </div>
    </div>
    <div class="flex flex-wrap mt-3">
      <div v-for="i in menuDashboard" :key="i">
        <nuxtLink :to="'/search' + i.url" class="btn btn-sm btn-outline mr-1 mb-1">
          <div>
            {{ i.title }}
            <div class="badge badge-secondary border-0">
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
  if (route.path == "/search") {
    navigateTo("/search/post");
  }
  // getApi();
});

onUnmounted(() => {
  useSearch.keySave = useSearch.key;
  useSearch.key = "";
});
</script>

<style></style>
