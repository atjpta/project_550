<template>
  <div class="">
    <!-- câu hỏi -->
    <div>
      <div class="hero min-h-[50vh] bg-gradient-to-r from-warning/10 via-warning/5 to-pink-500/0 hover:bg-gradient-to-l">
        <div class="hero-content flex-col lg:flex-row-reverse justify-between lg:w-3/5 px-5 mx-auto">
          <img src="~~/assets/images/question.jpg" class="w-80 max-w-sm rounded-lg shadow-2xl" />
          <div>
            <span
              class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
              <span class="relative text-white text-3xl font-black px-5">Câu hỏi</span>
            </span>
            <div class="space-y-3 my-5">
              <div class="text-xl indent-8 mb-3">
                Bạn có vấn đề nào đó mà không biết cách giải quyết!?
              </div>
              <div class="text-xl indent-8">
                Hãy đến đây!!! bạn có thể tự do đăng những câu hỏi mà bản thân không biết
                để nhờ mọi người trả lời giúp hoặc có thể bạn là vị cứu cho ai đó bằng
                cách trả lời câu hỏi giúp người khác
              </div>
            </div>
            <nuxtLink to="/question/new/1" class="btn btn-primary">xem ngay</nuxtLink>
          </div>
        </div>
      </div>
    </div>
    <!-- post -->
    <div>
      <div
        class="hero min-h-[50vh] hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div class="hero-content flex-col lg:flex-row-reverse justify-between lg:w-3/5 px-5 mx-auto">
          <img src="~~/assets/images/blog.jpg" class="w-80 rounded-lg shadow-2xl" />
          <div>
            <span
              class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
              <span class="relative text-white text-3xl font-black px-5">Bài viết </span>
            </span>
            <div class="space-y-3 my-5">
              <div class="text-xl indent-8 mb-3">
                Bạn có tâm sự và điều gì đó muốn kể!?
              </div>
              <div class="text-xl indent-8">
                Tại đây, mọi người có thể cũng nhau chia sẽ những trải nghiệm của bản thân
                với nhau
              </div>
            </div>
            <nuxtLink to="/post/new/1" class="btn btn-primary">xem ngay</nuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- topic series team -->

    <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10 my-10 lg:gap-20 lg:w-4/5 mx-5 lg:mx-auto">
      <div class="card w-full p-5 card-compact bg-base-100 shadow-xl">
        <div class="card-body">
          <div>
            <span
              class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
              <span class="relative text-white text-3xl font-black px-5">chủ đề </span>
            </span>
          </div>
          <p class="text-xl">Nơi các câu hỏi có cũng một chủ để bàn luận</p>
          <div class="card-actions justify-end">
            <nuxtLink to="/topic/new/1" class="btn btn-primary">xem ngay</nuxtLink>
          </div>
        </div>
      </div>

      <div class="card w-full p-5 card-compact bg-base-100 shadow-xl">
        <div class="card-body">
          <div>
            <span
              class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
              <span class="relative text-white text-3xl font-black px-5">
                chuỗi câu hỏi</span>
            </span>
          </div>
          <p class="text-xl">
            Nơi các bài viết sâu chuỗi với nhau làm người đọc có thể tìm kiếm dễ dàng các
            bài viết
          </p>
          <div class="card-actions justify-end">
            <nuxtLink to="/series/new/1" class="btn btn-primary">xem ngay</nuxtLink>
          </div>
        </div>
      </div>

      <div class="card w-full p-5 card-compact bg-base-100 shadow-xl">
        <div class="card-body">
          <div>
            <span
              class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
              <span class="relative text-white text-3xl font-black px-5">Nhóm</span>
            </span>
          </div>
          <p class="text-xl">
            Nơi không gian riêng tư cho nhóm của bạn trong cộng động này
          </p>
          <div class="card-actions justify-end">
            <nuxtLink to="/team" class="btn btn-primary">xem ngay</nuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "welcome",
  middleware: "guest",
});


</script>

<style></style>
