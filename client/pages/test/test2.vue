<template>
  <div>
    <input v-model="textSearch" class="input input-primary" type="text" />
    <div @click="getData()" class="btn btn-primary">ấn lấy search</div>
    <div v-for="item in useSearch.data" :key="item.id">
      <div v-html="item.title"></div>
      <div v-html="item.contentOnlyText"></div>
      <div class="divider"></div>
    </div>
  </div>
</template>

<script setup>
import { searchStore } from "~/stores/search.store";
const textSearch = ref();
const useSearch = searchStore();

async function getData() {
  try {
    await useSearch.search(textSearch.value);
  } catch (error) {
    console.log(error);
  }
}
</script>

<style></style>
