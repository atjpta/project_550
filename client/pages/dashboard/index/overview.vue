<template>
  <div class="mt-3 bg-base-200 rounded-2xl p-5">
    <div class="flex flex-wrap justify-center">
      <div class="stats shadow w-48 mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon="text-warning text-2xl" icon="fa-solid fa-star" />
          </div>
          <div class="stat-title">Điểm</div>
          <div class="stat-value">{{ score }}</div>
        </div>
      </div>
      <div class="stats shadow w-48 mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon="text-info text-2xl" icon="fa-solid fa-file-lines" />
          </div>
          <div class="stat-title">bài viết</div>
          <div class="stat-value">{{ useUser.overview.postCount || 0 }}</div>
        </div>
      </div>
      <div class="stats shadow w-48 mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon
              class-icon="text-primary text-2xl"
              icon="fa-solid fa-layer-group"
            />
          </div>
          <div class="stat-title">series</div>
          <div class="stat-value">{{ useUser.overview.seriesCount || 0 }}</div>
        </div>
      </div>
      <div class="stats shadow w-48 mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon
              class-icon="text-info text-2xl"
              icon="fa-solid fa-file-circle-question"
            />
          </div>
          <div class="stat-title">câu hỏi</div>
          <div class="stat-value">{{ useUser.overview.questionCount || 0 }}</div>
        </div>
      </div>
      <div class="stats shadow w-48 mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon
              class-icon="text-secondary text-2xl"
              icon="fa-solid fa-layer-group"
            />
          </div>
          <div class="stat-title">topic</div>
          <div class="stat-value">{{ useUser.overview.topicCount || 0 }}</div>
        </div>
      </div>
      <div class="stats shadow w-48 mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon=" text-2xl" icon="fa-solid fa-share" />
          </div>
          <div class="stat-title">câu trả lời</div>
          <div class="stat-value">{{ useUser.overview.answerCount || 0 }}</div>
        </div>
      </div>
      <div class="stats shadow w-48 mb-2 mr-2">
        <div class="stat">
          <div class="stat-figure">
            <OtherVIcon class-icon="text-error text-2xl" icon="fa-solid fa-heart" />
          </div>
          <div class="stat-title">theo dõi</div>
          <div class="stat-value">0</div>
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
async function getApi() {
  await useUser.findOverView(useAuth.user.id);
}

const score = computed(() => {
  let sum = 0;
  if (useUser.overview.vote_answer?.length > 0) {
    useUser.overview.vote_answer.forEach((e) => {
      sum += e.val;
    });
  }
  if (useUser.overview.vote_post?.length > 0) {
    useUser.overview.vote_post.forEach((e) => {
      sum += e.val;
    });
  }
  if (useUser.overview.vote_question?.length > 0) {
    useUser.overview.vote_question.forEach((e) => {
      sum += e.val;
    });
  }
  return sum;
});

onMounted(() => {
  getApi();
});
</script>

<style></style>
