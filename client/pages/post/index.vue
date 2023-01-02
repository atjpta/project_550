<template>
  <div class="">
    <!-- các nut lọc -->
    <div class="flex justify-between">
      <div class="space-x-1">
        <div v-for="i in 3" :key="i" class="btn btn-primary btn-outline btn-sm lg:btn-md">
          {{ i }} 0000
        </div>
      </div>
      <nuxt-link to="" class="btn btn-outline btn-success btn-sm lg:btn-md">
        tạo bài viết
      </nuxt-link>
    </div>
    <div>
      <div v-for="i in 10" :key="i">
        <PostVMono />
      </div>
    </div>
  </div>
</template>
