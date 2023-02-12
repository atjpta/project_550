<template>
  <div>
    <QuestionVEditT @save="save" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { questionStore } from "~~/stores/question.store";
import { tagStore } from "~~/stores/tag.store";

const useImage = imageStore();
const useTag = tagStore();
const useQuestion = questionStore();
let question;
const loading = ref(false);

function formatData(listtag) {
  const data = {
    author: question.author.id,
    content: question.content,
    topic: question.topic.id,
    status: [question.status.id],
    title: question.title,
    team: question.team._id,
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
  loading.value = true;
  try {
    const listtag = await useTag.createAll(question.tag);
    const data = formatData(listtag);
    const id = await useQuestion.create(data);
    useQuestion.resetQuestionEdit();
    navigateTo(`/question/${id}`);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
