<template>
  <div class="mt-3 rounded-2xl">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div class="stats shadow mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon="text-warning text-2xl" icon="fa-solid fa-star" />
          </div>
          <div class="stat-title">Điểm</div>
          <div class="stat-value">{{ score }}</div>
        </div>
      </div>
      <div @click="navigateTo(`/user/${useUser.overview._id}/post`)" class="stats shadow mb-2 mr-2 cursor-pointer">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon="text-info text-2xl" icon="fa-solid fa-file-lines" />
          </div>
          <div class="stat-title">Bài viết</div>
          <div class="stat-value">{{ useUser.overview.postCount || 0 }}</div>
        </div>
      </div>
      <div @click="navigateTo(`/user/${useUser.overview._id}/series`)" class="stats shadow mb-2 mr-2 cursor-pointer">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon="text-primary text-2xl" icon="fa-solid fa-layer-group" />
          </div>
          <div class="stat-title">Chuỗi bài viết</div>
          <div class="stat-value">{{ useUser.overview.seriesCount || 0 }}</div>
        </div>
      </div>
      <div @click="navigateTo(`/user/${useUser.overview._id}/question`)" class="stats shadow mb-2 mr-2 cursor-pointer">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon="text-info text-2xl" icon="fa-solid fa-file-circle-question" />
          </div>
          <div class="stat-title">Câu hỏi</div>
          <div class="stat-value">{{ useUser.overview.questionCount || 0 }}</div>
        </div>
      </div>
      <div @click="navigateTo(`/user/${useUser.overview._id}/topic`)" class="stats shadow mb-2 mr-2 cursor-pointer">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon="text-secondary text-2xl" icon="fa-solid fa-layer-group" />
          </div>
          <div class="stat-title">Chủ đề</div>
          <div class="stat-value">{{ useUser.overview.topicCount || 0 }}</div>
        </div>
      </div>
      <div class="stats shadow mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon=" text-2xl" icon="fa-solid fa-share" />
          </div>
          <div class="stat-title">Câu trả lời</div>
          <div class="stat-value">{{ useUser.overview.answerCount || 0 }}</div>
        </div>
      </div>
      <div class="stats shadow mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon="text-error text-2xl" icon="fa-solid fa-heart" />
          </div>
          <div class="stat-title">Theo dõi</div>
          <div class="stat-value">{{ useUser.overview.followsCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { userStore } from "~~/stores/user.store";

const useUser = userStore();
const useAuth = authStore();
const route = useRoute();
const score = computed(() => {
  let sum = 0;
  if (useUser.overview.vote_answer?.length > 0) {
    useUser.overview.vote_answer.forEach((e) => {
      if (e._id) {
        sum += e.val;
      }
    });
  }
  if (useUser.overview.vote_post?.length > 0) {
    useUser.overview.vote_post.forEach((e) => {
      if (e._id) {
        sum += e.val;
      }
    });
  }
  if (useUser.overview.vote_question?.length > 0) {
    useUser.overview.vote_question.forEach((e) => {
      if (e._id) {
        sum += e.val;
      }
    });
  }
  return sum;
});

async function getApi() {
  await useUser.findOverView(route.params.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
