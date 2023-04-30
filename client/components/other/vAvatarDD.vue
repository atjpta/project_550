<template>
  <div>
    <div class="">
      <nuxtLink
        to="/auth/signin"
        v-if="!useAuth.isUserLoggedIn"
        class="btn btn-outline mb-1"
      >
        Đăng nhập
      </nuxtLink>
      <div v-if="useAuth.isUserLoggedIn" class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <img class="w-12 h-12 rounded-full" :src="useUser.user.avatar_url" />
        </label>

        <ul
          tabindex="0"
          class="border-2 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        >
          <div class="flex space-x-1">
            <img class="w-12 h-12 rounded-full" :src="useUser.user.avatar_url" />
            <div class="mt-3 px-2">{{ useUser.user.name }}</div>
          </div>
          <li></li>

          <li class="hover-bordered" v-for="i in dataAvatarComputed" :key="i">
            <nuxtLink v-if="i.name != 'Đăng xuất'" :to="i.url">
              <OtherVIcon :icon="i.icon"></OtherVIcon>
              {{ i.name }}
            </nuxtLink>
            <nuxtLink @click="logout()" v-if="i.name == 'Đăng xuất'" :to="i.url">
              <OtherVIcon :icon="i.icon"></OtherVIcon>
              {{ i.name }}
            </nuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { userStore } from "~~/stores/user.store";
const useUser = userStore();
const useAuth = authStore();
const dataAvatar = [
  {
    name: "Theo dõi",
    url: "/follow",
    icon: "fa-solid fa-heart",
  },
  {
    name: "Trang dashboard",
    url: "/dashboard/read/overview",
    icon: "fa-solid fa-address-card",
  },

  {
    name: "Đăng xuất",
    url: "/auth/signin",
    icon: "fa-solid fa-right-from-bracket",
  },
];

const dataAvatarComputed = computed(() => {
  let list = [];
  if (useUser.isAdmin) {
    const admin = {
      name: " Trang Admin",
      url: "/admin/post",
      icon: "fa-solid fa-bars-progress",
    };
    list = [admin, ...dataAvatar];
  } else {
    list = [...dataAvatar];
  }
  return list;
});

function logout() {
  useAuth.logout();
  useUser.clear();
}
</script>
