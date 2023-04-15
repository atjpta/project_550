<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { alertStore } from "~/stores/alert.store";
import { memberStore } from "~/stores/member.store";

const useAlert = alertStore();
const useMember = memberStore();

onUpdated(() => {
  if (!useMember.isEditT) {
    useAlert.setWarning("bạn không có quyền truy cập");
    return navigateTo("/");
  }
});

definePageMeta({
  middleware: "guest",
});
</script>

<style></style>
