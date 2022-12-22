<template>
  <div>
    ghergheri
    <div @click="openDialogSignin()" class="btn">
      nút này cần đăng nhập mới hiện thêm nội dung
    </div>
    <div v-if="useAuth.isUserLoggedIn">
      đang là nội dung cần đăng nhập mới xem dc
    </div>
    {{ useAuth.user }}

     <NuxtLink to="/test2" @click="openDialogSignin()" class="btn">
      nút này cần đăng nhập mới qua được trang test2
    </NuxtLink>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { dialogStore } from "../stores/dialog.store";
const useAuth = authStore();
const useDialog = dialogStore()

function openDialogSignin() {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để thấy nội dung",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        navigateTo("/auth/signin");
      }
    );
  }
  else { 
    console.log('đã đăng nhập');
  }
}

onMounted(() => {});
</script>

<style>
</style>