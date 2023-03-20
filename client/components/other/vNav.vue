<template>
  <div class="bg-base-100">
    <!-- cho mobie -->
    <div class="dropdown">
      <label tabindex="0" class="">
        <div class="btn btn-ghost rounded-none">
          <OtherVIcon class-icon="text-2xl" icon="fa-solid fa-bars" />
        </div>
      </label>
      <div tabindex="0" class="dropdown-content mt-1 bg-base-100 w-60 h-screen">
        <ul class="menu">
          <div v-for="i in dataNav" :key="i">
            <div v-for="j in i" :key="j.name">
              <li class="hover-bordered">
                <nuxt-link :to="j.url">
                  <OtherVIcon class-icon="text-2xl" :icon="j.icon" />
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
const showtext = ref(false);
const open = ref(false);

const dataNav = ref([
  [
    {
      name: "Trang chủ",
      url: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Tìm kiếm",
      url: "/search",
      icon: "fa-solid fa-magnifying-glass",
    },
    {
      name: "Cá nhân",
      url: "/dashboard",
      icon: "fa-solid fa-address-card",
    },
    {
      name: "test",
      url: "/test",
      icon: "fa-solid fa-vial-circle-check",
    },
  ],
  [
    {
      name: "Bài viết",
      url: "/post/new/0",
      icon: "fa-solid fa-file-lines",
    },
    {
      name: "Chuỗi bài viết",
      url: "/series/new/0",
      icon: "fa-solid fa-layer-group",
    },
  ],
  [
    {
      name: "Câu hỏi",
      url: "/question/new/0",
      icon: "fa-solid fa-file-circle-question",
    },
    {
      name: "chủ đề",
      url: "/topic/new/0",
      icon: "fa-solid fa-layer-group",
    },
  ],
  [
    {
      name: "Nhóm",
      url: "/team",
      icon: "fa-solid fa-building-user",
    },
    {
      name: "Người dùng",
      url: "/user",
      icon: "fa-solid fa-users",
    },
    {
      name: "thẻ tag",
      url: "/tag",
      icon: "fa-solid fa-tag",
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
