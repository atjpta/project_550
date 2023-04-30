<template>
  <div>
    <div class="border-l-4 border-primary glass rounded-2xl h-20 p-2">
      <nuxtLink
        class="hover:text-sky-500 hover:scale-110 duration-500"
        :to="`/user/${data.user[0]._id}/overview`"
      >
        <!-- tác giả -->
        <div class="flex">
          <div class="avatar">
            <div class="w-16 h-16 rounded-full">
              <img :src="data.user[0].avatar_url" />
            </div>
          </div>
          <div class="text-2xl mx-3 font-bold">
            <div class="overflow-hidden text-clip h-8">
              {{ data.user[0].name }}
            </div>
            <div class="text-sm space-x-3">
              <div class="tooltip" data-tip="Điểm người dùng">
                <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
                {{ data.total_count }}
              </div>
              <div class="tooltip" data-tip="Số người theo dõi">
                <OtherVIcon class-icon="text-info" icon="fa-solid fa-user" />
                {{ data.followsCount }}
              </div>
            </div>
          </div>
        </div>
      </nuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
});
</script>

<style></style>
