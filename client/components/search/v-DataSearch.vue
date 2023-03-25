<template>
  <div class="w-full">
    <transition name="bounce">
      <div class="bg-base-300 h-72 p-5 rounded-2xl overflow-y-auto space-y-2">
        <div v-if="sumLength" class="text-center">không có dữ liệu</div>

        <!-- post -->
        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_post" :key="i._id">
            <div
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer"
            >
              <div data-tip="bài viết" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-file-lines" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.title }}
              </div>
            </div>
          </div>
        </div>
        <!-- series -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_series" :key="i._id">
            <div
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer"
            >
              <div data-tip="chuỗi bài viết" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-layer-group" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- question -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_question" :key="i._id">
            <div
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer"
            >
              <div data-tip="câu hỏi" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-file-circle-question" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.title }}
              </div>
            </div>
          </div>
        </div>
        <!-- topic -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_topic" :key="i._id">
            <div
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer"
            >
              <div data-tip="chủ đề" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-layer-group" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- user -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_user" :key="i._id">
            <div
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer"
            >
              <div data-tip="người dùng" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-users" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- team -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_team" :key="i._id">
            <div
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer"
            >
              <div data-tip="nhóm" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-building-user" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- tag -->

        <div class="w-full space-y-2">
          <div v-for="i in useSearch.list_search_tag" :key="i._id">
            <div
              class="bg-base-100 shadow-sm shadow-primary flex h-12 rounded-md p-2 cursor-pointer"
            >
              <div data-tip="tag" class="mr-5 tooltip text">
                <OtherVIcon icon="fa-solid fa-tag" />
              </div>
              <div class="overflow-hidden truncate">
                {{ i.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- end -->
      </div>
    </transition>
  </div>
</template>

<script setup>
import { searchStore } from "~~/stores/search.store";

const useSearch = searchStore();

const sumLength = computed(() => {
  return (
    useSearch.list_search_post.length +
      useSearch.list_search_question.length +
      useSearch.list_search_series.length +
      useSearch.list_search_topic.length +
      useSearch.list_search_user.length +
      useSearch.list_search_team.length +
      useSearch.list_search_tag.length ==
    0
  );
});
</script>

<style></style>
