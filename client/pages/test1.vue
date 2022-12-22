<template>
  <div>
    test1
  </div>
</template>

<script setup>

definePageMeta({
  middleware: ["auth"]
  // or middleware: 'auth'
})

onBeforeMount(() => { 
    console.log('gehrougiehr');
})
</script>

<style>

</style>