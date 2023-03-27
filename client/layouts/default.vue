<template>
  <div
    class="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 min-h-screen min-w-full"
  >
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
