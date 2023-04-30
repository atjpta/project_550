<template>
  <div class="hover:bg-base-100/50 p-3 rounded-2xl">
    <div class="flex justify-between items-center">
      <!-- tác giả -->
      <div class="basis-1/3">
        <nuxt-link
          :to="`/user/${data.author[0]._id}/overview`"
          class="flex items-center space-x-3 hover:text-info"
        >
          <div class="avatar">
            <div class="mask mask-squircle w-12 h-12">
              <img :src="data.author[0].avatar_url" />
            </div>
          </div>
          <div>
            <div class="font-bold">{{ data.author[0].name }}</div>
          </div>
        </nuxt-link>
      </div>
      <!-- tiêu đề -->
      <div class="text-left w-full">
        {{ data.content }}
      </div>

      <!-- các nút chức năng -->
      <div class="flex flex-wrap lg:flex-nowrap">
        <div data-tip="Xóa báo cáo" class="flex tooltip tooltip-left lg:tooltip-top">
          <div
            :class="[loading ? 'loading ' : '']"
            @click="deleteOne()"
            class="btn btn-sm btn-ghost text-error"
          >
            <OtherVIcon icon="fa-solid fa-x" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reportStore } from "~~/stores/report.store";
import { routeStore } from "~~/stores/route.store";

const useReport = reportStore();
const props = defineProps({
  data: Object,
});

const useRouteS = routeStore();

const loading = ref(false);

async function deleteOne() {
  loading.value = true;

  try {
    await useReport.deleteOne(props.data._id);
    await useRouteS.refreshData();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>
