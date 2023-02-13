<template>
  <div>
    <DashboardVInfo />
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { userStore } from "~~/stores/user.store";

const useUser = userStore();
const useAuth = authStore();

async function getApi() {
  // await useUser.findOne(useAuth.user.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
