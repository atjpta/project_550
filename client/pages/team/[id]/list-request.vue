<template>
  <div class="bg-base-200 rounded-2xl p-5">
    <div class="text-center font-medium text-2xl">Duyệt thành viên</div>
    <div class="animate-ping border-b-2 border-blue-500 h-1 w-2/5 mx-auto mb-5"></div>
    <div v-if="useMember.List_member.length > 0">
      <div v-for="i in useMember.List_member" :key="i.id">
        <MemberVMonoRequest :data="i" />
      </div>
    </div>
    <div v-else>
      <div class="text-center">Chưa có ai xin vào nhóm!!!</div>
    </div>
  </div>
</template>

<script setup>
import { memberStore } from "~~/stores/member.store";

const useMember = memberStore();
const route = useRoute();
async function getApi() {
  await useMember.findByRequestTeam(route.params.id);
}
onMounted(() => {
  getApi();
});
</script>

<style></style>
