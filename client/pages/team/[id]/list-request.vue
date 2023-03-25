<template>
  <div class="">
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
