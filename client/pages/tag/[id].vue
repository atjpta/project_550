<template>
  <div>
    <div>
      <TagVTag />
    </div>
    <div>
      <div class="flex flex-wrap mt-3">
        <div v-for="i in menuDashboard" :key="i">
          <nuxtLink :to="i.url" class="btn btn-sm btn-outline mr-1 mb-1 indicator">
            <div>
              {{ i.title }}
              <div v-show="i?.sl > 0" class="indicator-item badge badge-secondary border-0 mr-2">
                {{ i?.sl }}
              </div>
            </div>
          </nuxtLink>
        </div>
      </div>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { postStore } from "~~/stores/post.store";
import { questionStore } from "~~/stores/question.store";
import { roleStore } from "~~/stores/role.store";
import { seriesStore } from "~~/stores/series.store";
import { tagStore } from "~~/stores/tag.store";
import { teamStore } from "~~/stores/team.store";
import { topicStore } from "~~/stores/topic.store";

const route = useRoute();
const useQuestion = questionStore();
const useSeries = seriesStore();
const useTopic = topicStore();
const useTeam = teamStore();
const useTag = tagStore();
const usePost = postStore();
const useRole = roleStore();
const menuDashboard = ref([
  {
    title: "bài viết",
    url: `/tag/${route.params.id}/post`,
    sl: computed(() => {
      return usePost.list.length;
    }),
  },
  {
    title: "chuỗi bài biết",
    url: `/tag/${route.params.id}/series`,
    sl: computed(() => {
      return useSeries.List_series.length;
    }),
  },
  {
    title: "câu hỏi",
    url: `/tag/${route.params.id}/question`,
    sl: computed(() => {
      return useQuestion.list.length;
    }),
  },
  {
    title: "Chủ đề",
    url: `/tag/${route.params.id}/topic`,
    sl: computed(() => {
      return useTopic.List_topic.length;
    }),
  },
  {
    title: "nhóm",
    url: `/tag/${route.params.id}/team`,
    sl: computed(() => {
      return useTeam.List_team.length;
    }),
  },
]);

async function getApi() {
  await useTag.findOne(route.params.id);
  await usePost.findByTag(route.params.id);
  await useQuestion.findByTag(route.params.id);
  await useSeries.findByTag(route.params.id);
  await useRole.findAll();
  await useTeam.findByTag(route.params.id);
  await useTopic.findByTag(route.params.id);
}

onMounted(() => {
  useTopic.reset();
  useTeam.reset();
  getApi();
});

const title = computed(() => {
  return "#" + useTag.tag.name;
});

useHead({
  title: title,
});
</script>

<style></style>
