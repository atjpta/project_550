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
            class="w-fit btn btn-primary btn-outline flex lg:hidden mx-1"
          >
            <VIcon icon="fa-solid fa-bars" />
          </div>
          <!-- Sidebar content here -->
          <div v-if="open" class="w-80 rounded-2xl bg-base-200 absolute z-30">
            <div
              @click="closeMenu()"
              class="btn btn-primary btn-outline w-fit flex lg:hidden m-5"
            >
              <VIcon icon="fa-solid fa-x" />
            </div>
            <div v-for="i in dataMenu" :key="i.title">
              <div class="text-xl font-medium m-5">
                {{ i.title }}
                <ul class="menu">
                  <div v-for="j in i.data" :key="j.name">
                    <li class="hover-bordered text-base">
                      <nuxt-link :to="j.url" class="rounded-2xl">{{ j.name }}</nuxt-link>
                    </li>
                  </div>
                </ul>
                <div class="divider"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- nội dung -->
        <div class="flex">
          <!-- cho máy tính -->
          <div class="m-5 lg:flex hidden">
            <!-- Sidebar content here -->
            <div class="w-80 rounded-2xl bg-base-200">
              <div v-for="i in dataMenu" :key="i.title">
                <div class="text-xl font-medium m-5">
                  {{ i.title }}
                  <ul class="menu">
                    <div v-for="j in i.data" :key="j.name">
                      <li class="hover-bordered text-base">
                        <nuxt-link :to="j.url" class="rounded-2xl">{{
                          j.name
                        }}</nuxt-link>
                      </li>
                    </div>
                  </ul>
                  <div class="divider"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="m-5 z-0">
            <slot />
          </div>
        </div>
      </div>
      <!-- <VNavR /> -->
    </div>
  </div>
</template>

<script setup>
import VHeader from "~~/components/other/vHeader.vue";
import VIcon from "~~/components/other/vIcon.vue";
import VNavL from "~~/components/other/vNavL.vue";
import VNavR from "~~/components/other/vNavR.vue";

const dataMenu = ref([
  {
    title: "Chung",
    data: [
      {
        name: "bài viết",
        url: "/test1",
      },
      {
        name: "câu hỏi",
        url: "/test2",
      },
    ],
  },
  {
    title: "Nhóm",
    data: [
      {
        name: "nhóm 1",
        url: "/test3",
      },
      {
        name: "nhóm 2",
        url: "/test4",
      },
    ],
  },
  {
    title: "Khác",
    data: [
      {
        name: "bài viết gerg",
        url: "/test5",
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

<style scoped>
.router-link-exact-active {
  color: white;
  background: rgba(120, 0, 255);
}
</style>
