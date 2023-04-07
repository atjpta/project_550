<template>
  <div>
    <QuestionVEdit @save="saveEdit" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { questionStore } from "~~/stores/question.store";
import { tagStore } from "~~/stores/tag.store";
import { alertStore } from "~~/stores/alert.store";
import { teamStore } from "~~/stores/team.store";
const useTeam = teamStore();
const useAlert = alertStore();
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

function checkTeam() {
  let check = false;
  const id = question.team.id || question.team._id;
  if (id) {
    if (useTeam.List_team_ByUser[0]) {
      useTeam.List_team_ByUser.forEach((e) => {
        if (e._id == id) {
          check = true;
          return;
        }
      });
    } else {
      return false;
    }
  } else {
    return true;
  }
  return check;
}

async function saveEdit() {
  question = useQuestion.question_edit;
  if (!(question.content.ops[0].insert != "\n" && question.title)) {
    useAlert.setError("phải nhập đủ tiêu đề và nội dung");
    return;
  }
  const check = checkTeam();
  console.log(check);
  if (!check) {
    useAlert.setError("bạn không còn trong nhóm " + useQuestion.question_edit.team.name);
    return;
  }
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
</script>

<style></style>
