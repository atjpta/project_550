<template>
  <div class="">
    <!-- cho máy tính -->
    <div
      class="lg:flex overflow-y-auto scroll-smooth hidden h-screen w-60 bg-base-300/50 glass"
    >
      <div class="w-full">
        <!-- logo -->
        <div class="pt-1 text-center sticky top-0 z-30 bg-base-200">
          <div to="/" class="btn btn-ghost text-2xl font-bold">abctu</div>
          <div class="mx-auto animate-ping border-b-2 border-blue-500 h-3 w-20"></div>
        </div>

        <div class="h-fit z-20">
          <ul class="menu">
            <div v-for="i in dataNav" :key="i">
              <div v-for="j in i" :key="j.name">
                <li class="hover-bordered">
                  <nuxt-link :to="j.url">
                    <OtherVIcon class-icon="text-2xl" :icon="j.icon" />
                    <div :class="[showtext ? 'w-60' : '']">
                      {{ j.name }}
                    </div>
                  </nuxt-link>
                </li>
              </div>
              <div class="divider px-5"></div>
            </div>
          </ul>
        </div>
      </div>
    </div>

    <!-- cho mobie -->

    <div
      @mouseleave="showtext = false"
      :class="[showtext ? 'overflow-y-auto h-screen glass' : '']"
      class="duration-500 lg:hidden"
    >
      <div
        :class="[showtext ? 'rotate-180 ' : '']"
        class="sticky top-1 my-1 duration-500 z-40"
      >
        <div @click="openNav()" class="btn btn-primary rounded-none">
          <OtherVIcon
            class-icon="text-2xl"
            :icon="showtext ? 'fa-solid fa-x' : 'fa-solid fa-bars'"
          />
        </div>
      </div>

      <div v-if="showtext" class="bg-base-300/50">
        <div>
          <!-- logo -->
          <div class="pt-1 text-center sticky top-0 bg-base-100 z-30">
            <div class="btn btn-ghost text-2xl font-bold">
              {{ showtext ? "abctu" : "a" }}
            </div>
            <div class="mx-auto animate-ping border-b-2 border-blue-500 h-3 w-20"></div>
          </div>

          <div class="h-fit z-20">
            <ul class="menu">
              <div v-for="i in dataNav" :key="i">
                <div v-for="j in i" :key="j.name">
                  <li class="hover-bordered">
                    <nuxt-link @click="showtext = false" :to="j.url">
                      <OtherVIcon class-icon="text-2xl" :icon="j.icon" />
                      <div :class="[showtext ? 'w-60' : '']">
                        {{ showtext ? j.name : "" }}
                      </div>
                    </nuxt-link>
                  </li>
                </div>
                <div class="divider px-5"></div>
              </div>
            </ul>
          </div>
        </div>
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
      url: "/post",
      icon: "fa-solid fa-file-lines",
    },
    {
      name: "Chuỗi bài viết",
      url: "/series",
      icon: "fa-solid fa-layer-group",
    },
  ],
  [
    {
      name: "Câu hỏi",
      url: "/question",
      icon: "fa-solid fa-house",
    },
    {
      name: "chủ để",
      url: "/topic",
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
