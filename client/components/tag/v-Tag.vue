<template>
  <div class="bg-base-200 rounded-2xl border-b-4 border-info p-5">
    <div class="text-4xl font-bold uppercase mb-3">#{{ useTag.tag.name }}</div>
    <div class="text-xl indent-8">{{ useTag.tag.introduce }}</div>
  </div>
</template>

<script setup>
import { tagStore } from "~~/stores/tag.store";
const useTag = tagStore();
</script>

<style></style>
