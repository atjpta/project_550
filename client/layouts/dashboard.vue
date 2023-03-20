<template>
  <div class="">
    <OtherVAlert />
    <OtherVDialog />

    <div class="">
      <OtherVHeader class="sticky top-0 z-10" />
      <div class="pt-10 mx-5 md:mx-auto lg:w-4/6 md:w-5/6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style></style>
