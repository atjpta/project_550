<template>
  <div>
    <div
      v-if="loadingSkeleton"
      class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      <div v-for="i in 7" :key="i._id">
        <TagVSkeleton />
      </div>
    </div>

    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="i in useTag.List_tag" :key="i._id">
        <TagVMonoD :data="i" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { tagStore } from "~~/stores/tag.store";

const useTag = tagStore();
const route = useRoute();
const loadingSkeleton = ref(false);
const useAuth = authStore();

async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useTag.findByAuthor(useAuth.user.id);

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
