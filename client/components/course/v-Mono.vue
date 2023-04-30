<template>
  <div>
    <div
      @click="navigateTo(`/course/${data.id}/review`)"
      :style="`background: ${color};`"
      :class="!color ? 'bg-violet-500/50 hover:bg-violet-500/50' : ''"
      class="-skew-x-12 btn shadow-sm m-2 shadow-blue-500 border-0 w-96 h-40 font-extrabold text-2xl flex items-center justify-center p-10 overflow-clip"
    >
      <div class="text-2xl">
        {{ data.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
  color: String,
});
</script>

<style></style>
