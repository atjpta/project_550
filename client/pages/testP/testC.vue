<template>
  <div class="async-component loaded">
    <!-- We don't need a spinner here since loading is handled at the root -->
    <slot />
  </div>
</template>
<script setup>
const { time } = defineProps({
  time: {
    type: Number,
    required: true,
  },
});

// Add in a delay to simulate loading data
await new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, time);
});
</script>
