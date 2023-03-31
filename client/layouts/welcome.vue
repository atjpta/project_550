<template>
  <div class="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 min-w-full">
    <OtherVAlert />
    <OtherVDialog class="" />

    <div class="min-h-[calc(100vh-280px)]">
      <OtherVHeader class="sticky top-0 z-20" />
      <div class="">
        <slot />
      </div>
    </div>
    <div class="bg-indigo-500/20">
      <OtherVFooter class="md:mx-auto md:w-5/6" />
    </div>
  </div>
</template>

<script setup></script>

<style></style>
