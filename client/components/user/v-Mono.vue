<template>
  <div>
    <div class="border-l-4 border-primary glass rounded-2xl bg-base-200 p-2">
      <div class="text-center">
        <nuxtLink
          class="hover:text-sky-500 hover:scale-110 duration-500"
          :to="`/user/${data._id}/overview`"
        >
          <!-- tác giả -->
          <div class="">
            <div class="avatar">
              <div class="w-32 h-32 rounded-full">
                <img :src="data.avatar_url" />
              </div>
            </div>
            <div class="text-2xl mx-3 font-bold">
              <div class="overflow-hidden text-clip">
                {{ data.name }}
              </div>
              <div class="text-sm space-x-3">
                <div class="tooltip" data-tip="điểm người dùng">
                  <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
                  {{ data.total_count }}
                </div>
                <div class="tooltip" data-tip="số người theo dõi">
                  <OtherVIcon class-icon="text-info" icon="fa-solid fa-user" />
                  {{ data.followsCount }}
                </div>
              </div>
            </div>
          </div>
        </nuxtLink>
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
