<template>
  <div>
    <TeamVEdit @save="saveEdit" :loading="loading" />
  </div>
</template>

<script setup>
import { imageStore } from "~~/stores/image.store";
import { teamStore } from "~~/stores/team.store";
import { tagStore } from "~~/stores/tag.store";
import { alertStore } from "~~/stores/alert.store";

const useAlert = alertStore();
const useImage = imageStore();
const useTag = tagStore();
const useTeam = teamStore();
let team;
const loading = ref(false);

function formatData(listtag) {
  const data = {
    id: team.id,
    introduce: team.introduce,
    status: team.status,
    name: team.name,
    image_cover_url: useImage.url ?? team.image_cover_url,
  };
  if (listtag) {
    const array = Array.from(team.tag);
    const tag = listtag;
    array.forEach((e) => {
      tag.push(e.id ?? e._id);
    });
    data.tag = tag;
  } else {
    const array = Array.from(team.tag);
    const tag = [];
    array.forEach((e) => {
      tag.push(e.id ?? e._id);
    });
    data.tag = tag;
  }
  return data;
}

async function saveEdit() {
  team = useTeam.team_edit;
  if (!(team.introduce && team.name)) {
    useAlert.setError("phải nhập đủ tên và lời giới thiệu");
    return;
  }
  loading.value = true;
  try {
    const listtag = await useTag.createAll(team.tag);
    const data = formatData(listtag);
    if (useImage.url) {
      await useImage.uploadImage();
      data.image_cover_url = useImage.url;
    }
    await useTeam.update(data);
    useTeam.resetTeamEdit();
    useImage.url = null;

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
  title: "sửa nhóm",
});
</script>

<style></style>
