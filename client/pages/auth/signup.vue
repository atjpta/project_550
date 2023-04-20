<template>
  <div class="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-5">
    <AuthVSignup />
  </div>
</template>

<script setup>
const title = computed(() => {
  return useQuestion.question.title;
});

useHead({
  title: "đăng kí",
});
</script>

<style></style>
