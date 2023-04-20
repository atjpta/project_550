<template>
  <div>
    <QuestionVEditC @save="save" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { questionStore } from "~~/stores/question.store";
import { tagStore } from "~~/stores/tag.store";
import { alertStore } from "~~/stores/alert.store";
import { notificationStore } from "~~/stores/notification.store";
import { courseStore } from "~/stores/course.store";
const useAlert = alertStore();
const useImage = imageStore();
const useTag = tagStore();
const useQuestion = questionStore();
const useNotification = notificationStore();
const useCourse = courseStore();
const route = useRoute();
let question;
const loading = ref(false);

function formatData(listtag) {
  const data = {
    author: question.author.id,
    content: question.content,
    title: question.title,
    course: question.course.id,
  };
  if (listtag) {
    const array = Array.from(question.tag);
    const tag = listtag;
    array.forEach((e) => {
      tag.push(e.id);
    });
    data.tag = tag;
  } else {
    const array = Array.from(question.tag);
    const tag = [];
    array.forEach((e) => {
      tag.push(e.id);
    });
    data.tag = tag;
  }
  return data;
}

async function save() {
  question = useQuestion.question_edit;
  if (!(question.content.ops[0].insert != "\n" && question.title)) {
    useAlert.setError("phải nhập đủ tiêu đề và nội dung");
    return;
  }
  loading.value = true;

  const dataNotification = {
    model: route.params.id,
    content: `bạn có câu hỏi mới trong môn học "${useCourse.course.name}"`,
    url: `/course/${useCourse.course.id}/question`,
    type: "info",
  };

  try {
    const listtag = await useTag.createAll(question.tag);
    const data = formatData(listtag);
    console.log(data);
    const id = await useQuestion.create(data);
    useQuestion.resetQuestionEdit();
    await useNotification.create(dataNotification);
    useRouter().back();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
definePageMeta({
  middleware: "guest",
});

useHead({
  title: "tạo câu hỏi",
});
</script>

<style></style>
