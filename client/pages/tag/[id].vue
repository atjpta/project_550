<template>
  <div>
    <div><TagVTag /></div>
    <div>
      <div class="flex flex-wrap mt-3">
        <div v-for="i in menuDashboard" :key="i">
          <nuxtLink :to="i.url" class="btn btn-sm btn-outline mr-1 mb-1">
            <div>
              {{ i.title }}
              <div class="badge badge-secondary border-0">
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

const menuDashboard = ref([
  {
    title: "bài viết",
    url: `/tag/${route.params.id}/post`,
    sl: computed(() => {
      return usePost.list.length;
    }),
  },
  {
    title: "series",
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
    title: "Topic",
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
  getApi();
});
</script>

<style></style>
