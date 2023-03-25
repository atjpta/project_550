<template>
  <div
    class="bg-gradient-to-r from-primary/10 via-primary/5 to-pink-500/5 rounded-2xl border-l-4 border-primary p-5"
  >
    <div class="text-xl font-bold uppercase"># {{ data.name }}</div>

    <nuxtLink :to="`/tag/${data._id}/post`">
      <div class="text-center">
        <div class="btn text-info btn-ghost btn-sm">xem thêm</div>
      </div>
    </nuxtLink>
    <div class="text-sm italic lowercase text-right opacity-75">
      {{ data.total_count }} lần sử dụng
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
});
</script>

<style></style>
