<template>
  <div class="bg-base-200 rounded-2xl p-5">
    <div class="flex justify-around font-medium text-xl mb-3 text-center">
      <div>Tên</div>
      <div>Chức vụ</div>
      <div></div>
    </div>
    <div class="animate-ping border-b-2 border-blue-500 h-1 w-2/5 mx-auto mb-5"></div>

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
