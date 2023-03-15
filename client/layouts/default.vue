<template>
  <div>
    <OtherVAlert />
    <OtherVDialog />

    <OtherVNav class="fixed z-40" />
    <div class="lg:ml-60">
      <OtherVHeader class="z-10" />
      <div class="m-5">
        <slot />
      </div>
    </div>
    <OtherVFooterMusic class="fixed bottom-0 z-30" />
  </div>
</template>

<script setup></script>

<style></style>
