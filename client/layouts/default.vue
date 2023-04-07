<template>
  <div class="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 min-w-full">
    <OtherVDialog class="" />

    <div class="min-h-[calc(100vh-280px)]">
      <OtherVHeader class="sticky top-0 z-20" />
      <OtherVAlert class="h-0" />

      <div class="pt-5 mx-3 md:mx-auto lg:w-4/6 md:w-5/6">
        <slot />
      </div>
    </div>
    <div class="bg-indigo-500/20">
      <OtherVFooter class="mt-5 mx-5 md:mx-auto lg:w-4/6 md:w-5/6" />
    </div>
  </div>
</template>

<script setup></script>

<style></style>
