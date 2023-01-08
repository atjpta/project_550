<template>
  <div>
    <div @click="open()" class="btn">test</div>
    <v-test v-if="show" />
    <div></div>
  </div>
</template>

<script setup>
const show = ref(false);
function open() {
  show.value = !show.value;
}
</script>

<style></style>
