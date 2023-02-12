<template>
  <div>
    <QuestionVEdit @save="saveEdit" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { questionStore } from "~~/stores/question.store";
import { tagStore } from "~~/stores/tag.store";

const useImage = imageStore();
const useTag = tagStore();
const useQuestion = questionStore();
let question = useQuestion.question_edit;
const loading = ref(false);
function formatData(listtag) {
  const data = {
    id: question.id,
    content: question.content,
    status: [question.status.id],
    title: question.title,
    topic: (question.topic.id || question.topic._id) ?? " ",
    team: (question.team.id || question.team._id) ?? " ",
  };
  if (listtag) {
    const array = Array.from(question.tag);
    const tag = listtag;
    array.forEach((e) => {
      tag.push(e.id ?? e._id);
    });
    data.tag = tag;
  } else {
    const array = Array.from(question.tag);
    const tag = [];
    array.forEach((e) => {
      tag.push(e.id ?? e._id);
    });
    data.tag = tag;
  }
  return data;
}

async function saveEdit() {
  question = useQuestion.question_edit;
  loading.value = true;
  try {
    const listtag = await useTag.createAll(question.tag);
    const data = formatData(listtag);
    if (useImage.url) {
      await useImage.uploadImage();
      data.image_cover_url = useImage.url;
    }
    await useQuestion.update(data);
    useQuestion.resetQuestionEdit();
    navigateTo(`/question/${data.id}`);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
