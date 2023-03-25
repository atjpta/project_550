<template>
  <div>
    <PostVEdit @save="saveEdit" :loading="loading" />
  </div>
</template>

<script setup>
import { alertStore } from "~~/stores/alert.store";
import { imageStore } from "~~/stores/image.store";
import { postStore } from "~~/stores/post.store";
import { tagStore } from "~~/stores/tag.store";
import { teamStore } from "~~/stores/team.store";
const useTeam = teamStore();
const useImage = imageStore();
const useTag = tagStore();
const usePost = postStore();
const useAlert = alertStore();
let post = usePost.post_edit;
const loading = ref(false);
function formatData(listtag) {
  const data = {
    id: post.id,
    content: post.content,
    series: (post.series.id || post.series._id) ?? " ",
    team: (post.team.id || post.team._id) ?? " ",
    status: [post.status.id],
    title: post.title,
    image_cover_url: useImage.url ?? post.image_cover_url,
  };
  if (listtag) {
    const array = Array.from(post.tag);
    const tag = listtag;
    array.forEach((e) => {
      tag.push(e.id ?? e._id);
    });
    data.tag = tag;
  } else {
    const array = Array.from(post.tag);
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
  const id = post.team.id || post.team._id;
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
  post = usePost.post_edit;
  if (!(post.content.ops[0].insert != "\n" && post.title)) {
    useAlert.setError("phải nhập đủ tiêu đề và nội dung");
    return;
  }
  const check = checkTeam();
  if (!check) {
    useAlert.setError("bạn không còn trong nhóm " + usePost.post_edit.team.name);
    return;
  }
  loading.value = true;
  try {
    const listtag = await useTag.createAll(post.tag);
    const data = formatData(listtag);
    if (useImage.url) {
      await useImage.uploadImage();
      data.image_cover_url = useImage.url;
    }
    await usePost.update(data);
    usePost.resetPostEdit();
    navigateTo(`/post/${data.id}`);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
