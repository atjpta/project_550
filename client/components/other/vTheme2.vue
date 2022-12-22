<template>
  <div>
    <button
      @click="theme = !theme"
      class="btn btn-ghost mr-2"
      data-toggle-theme="dark,light"
      data-act-class="ACTIVECLASS"
    >
      <OtherVIcon
        classIcon="text-2xl w-10"
        :icon="theme ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"
      />
      <input
        v-model="theme"
        type="checkbox"
        class="toggle toggle-primary toggle-lg"
        checked
      />
    </button>
  </div>
</template>
<i class=""></i><i class="fa-solid fa-sun"></i>
<script setup>
import { ref, computed, onMounted } from "vue";
import { themeChange } from "theme-change";
const theme = ref();
function settheme() {
  theme.value = localStorage.getItem("theme") == "light" ? true : false;
}

onMounted(() => {
  settheme();
  themeChange(false);
});
</script>

<style></style>
