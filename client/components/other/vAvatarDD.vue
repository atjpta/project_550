<template>
  <div>
    <div class="">
      <nuxtLink
        to="/auth/signin"
        v-if="!useAuth.isUserLoggedIn"
        class="btn btn-primary btn-outline mb-1"
      >
        đăng nhập
      </nuxtLink>
      <div v-if="useAuth.isUserLoggedIn" class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <img class="w-12 h-12 rounded-full" src="~/assets/images/meo.jpg" />
        </label>

        <ul
          tabindex="0"
          class="mt-3 border-2 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        >
          <div class="avatar">
            <div class="w-12 h-12 rounded-full">
              <img src="~/assets/images/meo.jpg" />
            </div>
            <p class="mt-3 px-2">{{ useAuth.user.name }}</p>
          </div>
          <li></li>

          <li class="hover-bordered" v-for="i in dataAvatar" :key="i">
            <router-link v-if="i.name != 'Đăng xuất'" :to="i.url">
              <OtherVIcon :icon="i.icon"></OtherVIcon>
              {{ i.name }}
            </router-link>
            <router-link @click="logout()" v-if="i.name == 'Đăng xuất'" :to="i.url">
              <OtherVIcon :icon="i.icon"></OtherVIcon>
              {{ i.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";

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
    name: "Giỏ hàng",
    url: "/",
    icon: "fa-solid fa-cart-shopping",
  },
  {
    name: "Trang dashboard",
    url: "/",
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
}

onMounted(() => {
  useAuth.loadAuthState();
});
</script>

<style></style>
