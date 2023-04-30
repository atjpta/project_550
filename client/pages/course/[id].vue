<template>
  <div>
    <div>
      <CourseVCourse :data="useCourse.course" />
    </div>
    <div class="tabs my-5">
      <div v-for="i in menu" :key="i.name">
        <nuxtLink
          :to="`/course/${route.params.id}/${i.url}`"
          :class="route.path == `/course/${route.params.id}/${i.url}` ? 'tab-active' : ''"
          class="tab tab-bordered uppercase font-medium"
        >
          {{ i.name }}
        </nuxtLink>
      </div>
    </div>
    <div>
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import { courseStore } from "~/stores/course.store";

const route = useRoute();
const useCourse = courseStore();
const loadingSkeleton = ref(false);

const menu = ref([
  {
    name: "Đánh giá",
    url: "review",
  },
  {
    name: "Bài viết",
    url: "post",
  },
  {
    name: "Câu hỏi",
    url: "question",
  },
]);
async function getApi() {
  loadingSkeleton.value = true;
  try {
    await useCourse.findOneDelta(route.params.id);
    loadingSkeleton.value = false;
  } catch (error) {}
}

onMounted(() => {
  getApi();
});

const title = computed(() => {
  return useCourse.course.name;
});

useHead({
  title: title,
});
</script>

<style></style>
