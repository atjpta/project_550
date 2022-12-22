<template>
  <div>
    <VHeader />
    <OtherVAlert />
    <OtherVDialog />
    <div class="md:w-4/5 m-5 mx-auto">
        <slot/>
    </div>
  </div>
</template>

<script setup>
import VHeader from '~~/components/other/vHeader.vue';


</script>

<style>

</style>