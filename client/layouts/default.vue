<template>
  <div>
    <VHeader />
    <OtherVAlert />
    <OtherVDialog />

    <div class="m-5 mx-auto space-x-5">
      <div>
        <!-- cho dt -->
        <div class="my-5 flex lg:hidden">
          <!-- btn mở -->
          <div
            @click="openMenu()"
            class="w-fit btn btn-primary btn-outline flex lg:hidden mx-5 btn-sm"
          >
            <OtherVIcon icon="fa-solid fa-bars" />
          </div>
          <transition name="bounce">
            <!-- Sidebar content here -->
            <div
              v-if="open"
              class="w-80 rounded-2xl absolute z-30 min-h-screen shadow-md glass"
            >
              <div
                @click="closeMenu()"
                class="btn btn-primary btn-outline w-fit flex btn-sm lg:hidden m-5"
              >
                <OtherVIcon icon="fa-solid fa-x" />
              </div>
              <div v-for="i in dataMenu" :key="i.title">
                <div class="text-xl font-medium m-5">
                  <OtherVIcon :icon="i.icon" />
                  {{ i.title }}
                  <ul class="menu">
                    <div v-for="j in i.data" :key="j.name">
                      <li class="hover-bordered text-base">
                        <nuxt-link @click="closeMenu()" :to="j.url" class="rounded-2xl">
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
          </transition>
        </div>

        <!-- nội dung -->
        <div class="flex flex-row md:w-4/5 mx-auto">
          <!-- cho máy tính -->
          <div class="lg:flex hidden basis-1/6">
            <!-- Sidebar content here -->
            <div class="w-60"></div>
            <div class="rounded-2xl bg-base-200 glass h-fit w-60 fixed shadow-md">
              <div v-for="i in dataMenu" :key="i.title">
                <div class="text-xl font-medium m-5">
                  <OtherVIcon :icon="i.icon" />
                  {{ i.title }}
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
        name: "bài viết",
        url: "/post",
        icon: "fa-solid fa-file-lines",
      },
      {
        name: "câu hỏi",
        url: "/test2",
        icon: "fa-solid fa-file-circle-question",
      },
      {
        name: "tag",
        url: "/test/contentadmin",
        icon: "fa-solid fa-tag",
      },
    ],
  },
  {
    title: "Nhóm",
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
/* .bounce-leave-active {
  animation: bounce-in 0.5s reverse;
} */
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
