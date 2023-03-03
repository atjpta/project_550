<template>
  <div class="h-52 bg-base-200 rounded-2xl border-l-4 border-primary p-5">
    <div class="text-xl font-bold uppercase"># {{ data.tags[0].name }}</div>
    <div class="indent-8 h-24 overflow-auto">
      {{ data.tags[0].introduce }}
    </div>
    <nuxtLink :to="`/tag/${data.tags[0]._id}/post`">
      <div class="text-center">
        <div class="btn btn-info btn-outline btn-sm">xem thêm</div>
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
