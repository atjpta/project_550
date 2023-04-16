<template>
  <div class="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 min-w-full">
    <OtherVDialog class="" />

    <div class="min-h-[calc(100vh-280px)]">
      <OtherVHeader class="sticky top-0 z-20" />
      <OtherVAlert class="h-0" />

      <div class="mx-3 md:mx-auto lg:w-4/6 md:w-5/6 py-5">
        <slot />
      </div>
    </div>
    <div class="bg-indigo-500/20">
      <OtherVFooter class="mx-5 md:mx-auto lg:w-4/6 md:w-5/6" />
    </div>
  </div>
</template>

<script setup></script>

<style>
.router-link-active,
.router-link-exact-active {
  color: rgb(123, 0, 255);
  /* background: rgba(120, 0, 255); */
}

.btn-disabled {
  background-color: transparent;
}

* p {
  font-size: 20px;
}
</style>
