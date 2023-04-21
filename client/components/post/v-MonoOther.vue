<template>
  <div>
    <!-- <div class="h-60 w-96 glass rounded-sm">{{ data }}</div> -->
    <div @click="navigateTo(`/post/${data._id}`)">
      <div class="card rounded-md w-96 bg-base-100 cursor-pointer hover:bg-base-200">
        <div class="card-body">
          <div class="w-fit">
            <nuxtLink class="hover:text-sky-500 hover:scale-110 duration-500"
              :to="`/user/${data?.author[0]?._id}/overview`">
              <!-- tác giả -->
              <div class="flex">
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full">
                    <img :src="data.author[0].avatar_url" />
                  </div>
                </div>
                <div class="text-2xl mx-3">
                  {{ data.author[0].name }}
                  <div class="text-sm italic">
                    <i>{{ data.createdAt }}</i>
                  </div>
                </div>
              </div>
            </nuxtLink>
          </div>
          <h2 class="card-title text-2xl">{{ data.title }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
});
</script>

<style></style>
