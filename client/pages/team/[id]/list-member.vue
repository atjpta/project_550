<template>
  <div class="rounded-2xl">
    <div v-for="i in useMember.List_member" :key="i.id">
      <MemberVMono :data="i" />
    </div>
  </div>
</template>
<script setup>
import { memberStore } from "~~/stores/member.store";
import { roleStore } from "~~/stores/role.store";

const useMember = memberStore();
const route = useRoute();
const useRole = roleStore();
async function getApi() {
  await useMember.findByTeam(route.params.id);
}
onMounted(() => {
  getApi();
});
</script>

<style></style>
