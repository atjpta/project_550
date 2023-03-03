<template>
  <div>
    <div class="">
      <nuxtLink
        to="/auth/signin"
        v-if="!useAuth.isUserLoggedIn"
        class="btn btn-outline mb-1"
      >
        đăng nhập
      </nuxtLink>
      <div v-if="useAuth.isUserLoggedIn" class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <img class="w-12 h-12 rounded-full" :src="useUser.user.avatar_url" />
        </label>

        <ul
          tabindex="0"
          class="mt-3 border-2 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        >
          <div class="avatar">
            <div class="w-12 h-12 rounded-full">
              <img :src="useUser.user.avatar_url" />
            </div>
            <p class="mt-3 px-2">{{ useUser.user.name }}</p>
          </div>
          <li></li>

          <li class="hover-bordered" v-for="i in dataAvatar" :key="i">
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
const dataAvatar = ref([
  {
    name: "Tạo bài viết",
    url: "/test/uploadimage",
    icon: "fa-solid fa-file-circle-plus",
  },
  {
    name: "Tạo câu hỏi",
    url: "/test/contentadmin/",
    icon: "fa-solid fa-file-circle-question",
  },
  {
    name: "theo dõi",
    url: "/follow",
    icon: "fa-solid fa-heart",
  },
  {
    name: "Trang dashboard",
    url: "/dashboard/overview",
    icon: "fa-solid fa-address-card",
  },

  {
    name: "Đăng xuất",
    url: "/",
    icon: "fa-solid fa-right-from-bracket",
  },
]);

function logout() {
  useAuth.logout();
  useUser.clear();
}

onMounted(() => {
  useAuth.loadAuthState();
  if (useAuth.user) {
    useUser.findOne(useAuth.user.id);
  }
});
</script>

<style>
.nuxtLink-exact-active {
  color: white;
  background: rgb(120, 0, 255);
}
</style>
