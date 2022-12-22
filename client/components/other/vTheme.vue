<template>
  <div>
    <select data-choose-theme class="select select-accent w-full max-w-xs">
      <option value="">Mặc định</option>
      <option v-for="i in themes" :key="i" :value="i">{{ i }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { themeChange } from "theme-change";

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];
onMounted(() => {
  themeChange(false);
});
</script>

<style></style>
