<template>
  <div class="">
    <!-- cho mobie -->
    <div
      :class="
        route.path != '/' &&
        route.path != '/welcome' &&
        route.path != '/auth/signup' &&
        route.path != '/auth/signin'
          ? '2xl:dropdown-open'
          : ''
      "
      class="dropdown"
    >
      <label tabindex="0" class="">
        <div class="btn btn-ghost rounded-none">
          <OtherVIcon class-icon="text-2xl" icon="fa-solid fa-bars" />
        </div>
      </label>
      <div
        tabindex="0"
        class="dropdown-content glass bg-base-100/90 hover:bg-base-100/90 mt-1.5 w-60 h-[calc(96vh)]"
      >
        <ul class="menu">
          <!-- chỉ admin -->
          <li
            v-if="useUser.isAdmin"
            :class="tagUrl.slice(0, 6) == '/admin' ? 'router-link-active' : ''"
            class="hover-bordered"
          >
            <nuxt-link to="/admin/post">
              <OtherVIcon class-icon="text-2xl w-7" icon="fa-solid fa-bars-progress" />
              <div class="text-base">
                {{ "Trang admin" }}
              </div>
            </nuxt-link>
          </li>
          <!-- người dùng bth -->
          <div v-for="i in dataNav" :key="i">
            <div v-for="j in i" :key="j.name">
              <li
                :class="
                  tagUrl.slice(0, j.tag?.length) == j.tag && j.tag != '/'
                    ? 'router-link-active'
                    : ''
                "
                class="hover-bordered"
              >
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
      name: "Trang chủ",
      url: "/",
      icon: "fa-solid fa-house",
      tag: "/",
    },
    {
      name: "Tìm kiếm",
      url: "/search",
      icon: "fa-solid fa-magnifying-glass",
      tag: "/search",
    },
    // useUser.isAdmin == true
    //   ? {
    //       name: "Admin",
    //       url: "/search",
    //       icon: "fa-solid fa-bars-progress",
    //       tag: "/search",
    //     }
    //   : "",
    {
      name: "test",
      url: "/test",
      icon: "fa-solid fa-vial-circle-check",
      tag: "/test",
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
  [
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
