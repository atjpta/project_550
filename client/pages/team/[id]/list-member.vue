<template>
  <div>
    <div v-if="loadingSkeleton" class="rounded-2xl">
      <div v-for="i in 7" :key="i">
        <MemberVSkeleton />
      </div>
    </div>

    <div v-else class="rounded-2xl">
      <div v-for="i in useMember.List_member" :key="i.id">
        <MemberVMono :data="i" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { memberStore } from "~~/stores/member.store";
import { roleStore } from "~~/stores/role.store";
const loadingSkeleton = ref(false);
const useMember = memberStore();
const route = useRoute();
const useRole = roleStore();
async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useMember.findByTeam(route.params.id);

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
