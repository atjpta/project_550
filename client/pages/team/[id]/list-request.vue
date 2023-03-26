<template>
  <div class="">
    <div v-if="loadingSkeleton">
      <div v-for="i in 7" :key="i">
        <MemberVSkeleton />
      </div>
    </div>
    <div v-else-if="useMember.List_member.length > 0">
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
const loadingSkeleton = ref(false);
async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useMember.findByRequestTeam(route.params.id);
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}
onMounted(() => {
  getApi();
});
</script>

<style></style>
