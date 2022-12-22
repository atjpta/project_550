<template>
  <div>
    <div @click="test()" class="btn">ấn vô để test quyền admin</div>
    {{ data }}
  </div>
</template>

<script setup>
import testService from "~~/services/test.service";
const data = ref();
async function test() {
  data.value = await testService.adminBoard();
}
</script>

<style></style>
