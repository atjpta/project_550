<template>
  <div>
    <OtherVDialog />
    <VHeader />
    <OtherVAlert />

    <div class="m-5 mx-auto space-x-5">
      <div>
        <!-- cho dt -->
        <div class="my-5 flex lg:hidden min-h-full">
          <!-- btn mở -->
          <div
            @click="openMenu()"
            class="w-fit btn btn-primary btn-outline flex mx-5 btn-sm"
          >
            <OtherVIcon icon="fa-solid fa-bars" />
          </div>
          <transition name="bounce">
            <!-- Sidebar content here -->

            <div v-if="open" class="absolute flex z-30 min-h-full min-w-full top-0">
              <!-- bg nền -->
              <div
                @click="closeMenu()"
                class="z-20 min-h-full min-w-full bg-red-300/20"
              ></div>
              <!-- phần nội dung -->
              <div
                class="w-80 absolute rounded-2xl z-30 shadow-md bg-base-300/50 glass p-5 min-h-screen"
              >
                <div
                  @click="closeMenu()"
                  class="btn btn-primary btn-outline w-fit flex btn-sm"
                >
                  <OtherVIcon icon="fa-solid fa-x" />
                </div>
                <div v-for="i in dataMenu" :key="i.title">
                  <div class="collapse collapse-plus">
                    <input type="checkbox" :checked="i == dataMenu[0] ? true : false" />
                    <div class="collapse-title text-xl font-medium">
                      <OtherVIcon :icon="i.icon" />
                      {{ i.title }}
                    </div>
                    <div class="collapse-content">
                      <ul class="menu">
                        <div v-for="j in i.data" :key="j.name">
                          <li class="hover-bordered text-base">
                            <nuxt-link :to="j.url" class="rounded-2xl">
                              <OtherVIcon :icon="j.icon" />
                              {{ j.name }}
                            </nuxt-link>
                          </li>
                        </div>
                      </ul>

                      <div class="divider"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- nội dung -->
        <div class="flex flex-row md:w-4/5 mx-auto">
          <!-- cho máy tính -->
          <div class="lg:flex hidden basis-1/6">
            <!-- Sidebar content here -->
            <!-- <div class="w-60"></div> -->
            <div class="rounded-2xl bg-base-300/50 glass h-fit w-60 sticky shadow-md">
              <div v-for="i in dataMenu" :key="i.title">
                <div class="collapse collapse-plus">
                  <input type="checkbox" :checked="i == dataMenu[0] ? true : false" />
                  <div class="collapse-title text-xl font-medium">
                    <OtherVIcon :icon="i.icon" />
                    {{ i.title }}
                  </div>
                  <div class="collapse-content">
                    <ul class="menu">
                      <div v-for="j in i.data" :key="j.name">
                        <li class="hover-bordered text-base">
                          <nuxt-link :to="j.url" class="rounded-2xl">
                            <OtherVIcon :icon="j.icon" />
                            {{ j.name }}
                          </nuxt-link>
                        </li>
                      </div>
                    </ul>

                    <div class="divider"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mx-5 z-0 w-full lg:basis-2/3">
            <slot />
          </div>

          <div class="basis-1/6 lg:flex hidden bg-base-200 glass rounded-2xl"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import VHeader from "~~/components/other/vHeader.vue";
const test = ref(false);
const dataMenu = ref([
  {
    title: "Chung",
    icon: "fa-solid fa-house",
    data: [
      {
        name: "Bài viết",
        url: "/post",
        icon: "fa-solid fa-file-lines",
      },
      {
        name: "Series",
        url: "/test/contentadmin",
        icon: "fa-solid fa-layer-group",
      },
      {
        name: "Câu hỏi",
        url: "/question",
        icon: "fa-solid fa-file-circle-question",
      },
      {
        name: "Topic",
        url: "/test/contentadmin",
        icon: "fa-solid fa-layer-group",
      },
      {
        name: "Người dùng",
        url: "/test/contentadmin",
        icon: "fa-solid fa-user",
      },
      {
        name: "Nhóm",
        url: "/team",
        icon: "fa-solid fa-users",
      },
      {
        name: "tag",
        url: "/test/contentadmin",
        icon: "fa-solid fa-tag",
      },
    ],
  },
  {
    title: "Nhóm của bạn",
    icon: "fa-solid fa-users",

    data: [
      {
        name: "nhóm 1",
        url: "/test/contentadmin",
        icon: "fa-solid fa-users",
      },
      {
        name: "nhóm 2",
        url: "/test/contentadmin",
        icon: "fa-solid fa-file-circle-question",
      },
      {
        name: "Tạo nhóm mới",
        url: "/test/contentadmin",
        icon: "fa-solid fa-circle-plus",
      },
    ],
  },
  {
    title: "Khác",
    icon: "fa-solid fa-file-circle-question",
    data: [
      {
        name: "bài viết gerg",
        url: "/test/contentadmin",
        icon: "fa-solid fa-file-circle-question",
      },
    ],
  },
]);
const open = ref(false);

function openMenu() {
  open.value = true;
}

function closeMenu() {
  open.value = false;
}
</script>

<style>
.router-link-exact-active {
  color: white;
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
