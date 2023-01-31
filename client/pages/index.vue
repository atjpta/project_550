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
    <div class="mb-5 space-y-5 rounded-2xl bg-base-200 p-5">
      <div class="text-6xl font-bold">B - blog, nơi chia sẻ kinh nghiệm của bạn</div>
      <div class="text-xl indent-8">
        Tại chỗ này, là nơi mà bạn có thể thoải mái đăng tải những bài viết của bản thân
        về các kinh nghiệm trong cuộc sống ctu của bạn
      </div>
      <div class="text-center">
        <nuxtLink to="/post" class="btn btn-primary btn-outline">xem ngay</nuxtLink>
      </div>
    </div>
    <div class="rounded-2xl bg-base-200 p-5 lg:flex flex-row">
      <div class="text-4xl font-bold indent-8 lg:my-auto basis-1/2 mb-5">
        hãy cùng nhau góp phần xây dựng một cộng đồng lớn mạnh, thân thiện nhé!!!
      </div>
      <div class="basis-1/2">
        <img class="rounded-2xl m-auto" src="@/assets/images/cuoi.gif" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style></style>
