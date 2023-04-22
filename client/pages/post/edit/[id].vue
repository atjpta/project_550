<template>
  <div>
    <PostVEdit :data="data" @save="saveEdit" :loading="loading" />
  </div>
</template>

<script setup>
import { authStore } from "~/stores/auth.store";
import { alertStore } from "~~/stores/alert.store";
import { imageStore } from "~~/stores/image.store";
import { postStore } from "~~/stores/post.store";
import { tagStore } from "~~/stores/tag.store";
const useImage = imageStore();
const useTag = tagStore();
const usePost = postStore();
const useAlert = alertStore();
const useAuth = authStore();
const route = useRoute();
const data = ref({});
const loading = ref(false);

function formatData(listtag) {
  const dataS = {
    id: route.params.id,
    content: data.value.content,
    title: data.value.title,
    status: data.value.status,
    course: (data.value.course.id || data.value.course._id) ?? " ",
    series: (data.value.series.id || data.value.series._id) ?? " ",
    team: (data.value.team.id || data.value.team._id) ?? " ",
    image_cover_url: useImage.url ?? data.value.image_cover_url,
  };
  if (listtag) {
    const array = Array.from(data.value.tag);
    const tag = listtag;
    array.forEach((e) => {
      tag.push(e.id ?? e._id);
    });
    dataS.tag = tag;
  } else {
    const array = Array.from(data.value.tag);
    const tag = [];
    array.forEach((e) => {
      tag.push(e.id ?? e._id);
    });
    dataS.tag = tag;
  }
  return dataS;
}

async function saveEdit() {
  if (!(data.value.content.ops[0].insert != "\n" && data.value.title)) {
    useAlert.setError("phải nhập đủ tiêu đề và nội dung");
    return;
  }

  loading.value = true;
  try {
    const listtag = await useTag.createAll(data.value.tag);
    const dataS = formatData(listtag);
    if (useImage.url) {
      await useImage.uploadImage();
      dataS.image_cover_url = useImage.url;
    }
    await usePost.update(dataS);
    usePost.resetPostEdit();
    useImage.url = null;

    useRouter().back();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function getApi() {
  if (route.params.id) {
    await usePost.findOneEdit(route.params.id);
    if (usePost.post.author._id != useAuth.user.id) {
      useAlert.setWarning("bạn không có quyền truy cập");
      return navigateTo("/");
    }
    data.value = usePost.post;
    if (!data.value.course) {
      data.value.course = {};
    } else {
      data.value.course = {
        id: usePost.post.course._id,
        name: usePost.post.course.name,
      };
    }
    if (!data.value.series) {
      data.value.series = {};
    } else {
      data.value.series = {
        id: usePost.post.series._id,
        name: usePost.post.series.name,
      };
    }
    if (!data.value.team) {
      data.value.team = {};
    }
  }
}

onMounted(() => {
  getApi();
});

definePageMeta({
  middleware: "guest",
});

useHead({
  title: "sửa bài viết",
});
</script>

<style></style>
