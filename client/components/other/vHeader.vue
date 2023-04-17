<template>
  <div class="glass ring-0">
    <div class="text-xl shadow-sm pt-1">
      <div class="flex justify-between">
        <div class="flex">
          <OtherVNav class="" @click="open = true" />
          <div @click="navigateTo('/')" class="btn btn-ghost bg-transparent hover:bg-transparent font-black text-white">
            <!-- logo -->
            <span
              class="before:ring-8 before:ring-indigo-500/20 hover:before:translate-x-2 hover:before:rotate-180 before:duration-500 before:rounded-tr-none before:rounded-bl-rounded-tr-none translate before:block before:absolute before:-inset-1 before:skew-y-12 before:skew-x-12 before:bg-gradient-to-r before:from-green-500 before:via-teal-500/50 before:to-blue-500 relative inline-block">
              <span
                class="before:ring-8 before:ring-pink-500/20 hover:before:-translate-x-2 hover:before:-rotate-180 before:duration-500 before:rounded-tl-rounded-tr-none before:rounded-br-rounded-tr-none before:block before:absolute before:-inset-1 before:-skew-y-12 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500/50 before:to-pink-500 relative inline-block">
                <span class="relative italic px-2">abctu</span>
              </span>
            </span>
          </div>
        </div>
        <div class="lg:flex hidden">
          <div v-for="i in dataHeader" :key="i.name">
            <nuxtLink :class="
              tagUrl[1] == i.tag && tagUrl[2] != 'edit' ? 'router-link-active' : ''
            " :to="i.url" class="btn btn-ghost">
              {{ i.title }}
            </nuxtLink>
          </div>

          <div v-if="useAuth.user" class="dropdown dropdown-hover">
            <label tabindex="0" :class="
              (tagUrl[1] == 'post' || tagUrl[1] == 'question') && tagUrl[2] == 'edit'
                ? 'router-link-active'
                : ''
            " class="btn btn-ghost">đăng bài</label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li class="hover-bordered">
                <nuxtLink to="/post/edit">bài viết mới</nuxtLink>
              </li>
              <li class="hover-bordered">
                <nuxtLink to="/question/edit">câu hỏi mới</nuxtLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="sm:flex hidden form-control w-1/3 relative">
          <div>
            <div class="input-group" v-if="route.path.slice(0, 7) != '/search'">
              <input @focusout="focus = false" @focusin="focus = true" v-model="useSearch.key" type="text"
                placeholder="Tìm kiếm…" class="input input-bordered w-full" />

              <button class="btn btn-square">
                <OtherVIcon icon="fa-solid fa-magnifying-glass" />
              </button>
            </div>
          </div>
          <SearchVDataSearch v-if="
            focus && useSearch.key.length > 0 && route.path.slice(0, 7) != '/search'
          " class="absolute top-14" />
        </div>

        <div class="flex">
          <NotificationVList v-if="useAuth.user" />
          <OtherVTheme2 />
          <OtherVAvatarDD />
        </div>
      </div>
    </div>
    <div @click="open = false" v-if="open" class="fixed h-screen w-screen sm:hidden"></div>
  </div>
</template>

<script setup>
import { typecourseStore } from "~/stores/typecourse.store";
import { authStore } from "~~/stores/auth.store";
import { searchStore } from "~~/stores/search.store";
import { userStore } from "~~/stores/user.store";
const useUser = userStore();
const useAuth = authStore();
const open = ref(false);
const useSearch = searchStore();
const route = useRoute();
const countKey = ref(0);
const useTypeCourse = typecourseStore();
const focus = ref(false);
const tagUrl = computed(() => {
  return route.fullPath.split("/");
});

const dataHeader = ref([
  {
    title: "Bài viết",
    url: "/post/new/1",
    tag: "post",
  },
  {
    title: "Câu hỏi",
    url: "/question/new/1",
    tag: "question",
  },
  {
    title: "Môn học",
    url: "/course",
    tag: "course",
  },
]);

onUpdated(() => {
  if (useSearch.key.length > 0 && countKey.value == 0) {
    useSearch.getApi();
    countKey.value = 1;
  }
});

async function getApi() {
  try {
    useAuth.loadAuthState();

    if (useAuth.user) {
      await useUser.findOne(useAuth.user.id);
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getApi();
});
</script>
