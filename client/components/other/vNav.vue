<template>
  <div class="pl-1">
    <!-- cho mobie -->
    <div class="dropdown">
      <label tabindex="0" class="">
        <div class="btn btn-ghost rounded-none">
          <OtherVIcon class-icon="text-2xl " icon="fa-solid fa-bars" />
        </div>
      </label>
      <div tabindex="0" class="dropdown-content glass bg-base-100/90 mt-2 hover:bg-base-100/90 w-60 h-[calc(96vh)]">
        <ul class="menu">
          <div v-for="i in dataNav" :key="i">
            <div v-for="j in i" :key="j.name">
              <li :class="
                tagUrl.slice(0, j.tag?.length) == j.tag && j.tag != '/'
                  ? 'router-link-active'
                  : ''
              " class="hover-bordered">
                <nuxt-link :to="j.url">
                  <OtherVIcon class-icon="text-2xl w-7" :icon="j.icon" />
                  <div class="text-base">
                    {{ j.name }}
                  </div>
                </nuxt-link>
              </li>
            </div>
            <div v-if="i != dataNav[dataNav.length - 1]" class="divider px-5"></div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";

const useUser = userStore();

const showtext = ref(false);
const open = ref(false);
const route = useRoute();

const tagUrl = computed(() => {
  return route.path;
});

const dataNav = ref([
  [
    {
      name: "Tìm kiếm",
      url: "/search",
      icon: "fa-solid fa-magnifying-glass",
      tag: "/search",
    },
    {
      name: "Nhóm",
      url: "/team",
      icon: "fa-solid fa-building-user",
      tag: "/team",
    },
    {
      name: "Người dùng",
      url: "/user",
      icon: "fa-solid fa-users",
      tag: "/user",
    },
    {
      name: "Thẻ tag",
      url: "/tag",
      icon: "fa-solid fa-tag",
      tag: "/tag",
    },
  ],

  [
    {
      name: "Bài viết",
      url: "/post/new/1",
      icon: "fa-solid fa-file-lines",
      tag: "/post",
    },
    {
      name: "Chuỗi bài viết",
      url: "/series/new/1",
      icon: "fa-solid fa-layer-group",
      tag: "/series",
    },
  ],
  [
    {
      name: "Câu hỏi",
      url: "/question/new/1",
      icon: "fa-solid fa-file-circle-question",
      tag: "/question",
    },
    {
      name: "Chủ đề",
      url: "/topic/new/1",
      icon: "fa-solid fa-layer-group",
      tag: "/topic",
    },
  ],
]);

function openNav() {
  if (open.value) {
    open.value = false;
    showtext.value = false;
  } else {
    showtext.value = true;
    open.value = true;
  }
}

onUpdated(() => {
  if (!showtext.value) {
    open.value = false;
  }
});
</script>

<style>
.router-link-active,
.router-link-exact-active {
  color: rgb(255, 255, 255);
  background: rgba(120, 0, 255);
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce2-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}
</style>
