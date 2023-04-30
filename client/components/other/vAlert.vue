<template>
  <!-- <div class="toast toast-top toast-center sm:w-[50vw] w-[80vw] h-fit bg-black z-40"> -->
  <div class="sticky top-16 sm:w-[50vw] w-[80vw] z-40 mx-auto bg-black">
    <!-- thông báo bình thường -->
    <div v-if="useAlert.success.info > 0" class="alert alert-info shadow-lg ml-auto">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          class="stroke-current flex-shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>
          {{ useAlert.info.message || "đây là cảnh báo bình thường" }}
        </span>
      </div>
    </div>

    <!-- thông báo thành công -->
    <div v-if="useAlert.success.set > 0" class="alert alert-success shadow-lg ml-auto">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          {{ useAlert.success.message || "đây là cảnh báo xử lý thành công" }}
        </span>
      </div>
    </div>

    <!-- lỗi -->
    <div v-if="useAlert.error.set > 0" class="alert alert-error shadow-lg ml-auto">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ useAlert.error.message || "đây là cảnh báo xử lý sai" }}</span>
      </div>
    </div>

    <!-- cảnh báo -->

    <div v-if="useAlert.warning.set > 0" class="alert alert-warning shadow-lg ml-auto">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none"
          viewBox="0 0 24 24">
          <path tro stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>
          {{ useAlert.warning.message || "đây là cảnh báo có gì đó không ổn" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { alertStore } from "~~/stores/alert.store";
import { onUpdated, ref } from "vue";
const time = ref(0);
const useAlert = alertStore();

setInterval(() => {
  useAlert.error.set--;
  useAlert.success.set--;
  useAlert.info.set--;
  useAlert.warning.set--;
}, 1000);
onUpdated(() => { });
</script>

<style></style>
