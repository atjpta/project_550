<template>
  <div class="">
    <div class="mb-5 space-y-5 rounded-2xl bg-base-200 p-5">
      <div class="text-6xl font-bold">ABCtu là gì?</div>
      <div class="text-xl indent-8">
        đây là 1 trang web cho sinh viên ctu vào có thể thoãi mái chia sẻ kiến thức, giải
        đáp các thắc mắc của bản thân ^^
      </div>
    </div>
    <div class="mb-5 space-y-5 rounded-2xl bg-base-200 p-5">
      <div class="text-6xl font-bold">A - answer, nơi trả lời thắc mắc của bạn</div>
      <div>
        <div class="text-xl indent-8 mb-3">
          Bạn có 1 vấn đề nào đó mà không biết cách giải quyết!?
        </div>
        <div class="text-xl indent-8">
          Hãy đến đây!!! bạn có thể tự do đăng những câu hỏi mà bản thân không biết để nhờ
          mọi người trả lời giúp hoặc có thể bạn là vị cứu cho ai đó bằng cách trả lời câu
          hỏi giúp người khác
        </div>
      </div>
      <div class="text-center">
        <nuxtLink to="/question" class="btn btn-primary btn-outline">xem ngay</nuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "guest",
});
</script>

<style></style>
