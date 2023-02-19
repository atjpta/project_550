<template>
  <div class="rounded-2xl bg-base-200 py-5 lg:pl-5">
    <div class="lg:flex justify-evenly">
      <!-- ảnh -->
      <div class="w-64 mx-auto lg:mx-0">
        <img
          class="bg-black/50 h-64 w-64 rounded-full"
          :src="useUser.overview.avatar_url"
          alt=""
        />
      </div>

      <div class="mt-5 lg:mt-0 px-5 lg:w-96">
        <!-- tên -->
        <div class="text-3xl font-bold mb-5">
          <div class="text-3xl font-semibold">{{ useUser.overview.name }}</div>
        </div>

        <!--giới thiệu -->
        <div class="">
          {{ useUser.overview.introduce || "chưa có lời giới thiệu" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";
const useUser = userStore();
</script>

<style></style>
