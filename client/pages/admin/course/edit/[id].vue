<template>
  <div>
    <CourseVEdit @save="save" :data="data" :loading="loading" />
  </div>
</template>

<script setup>
import { authStore } from "~/stores/auth.store";
import { alertStore } from "~~/stores/alert.store";
import { courseStore } from "~~/stores/course.store";
const loading = ref(false);
const data = ref({
  type: {},
});
const useModel = courseStore();
const useAlert = alertStore();
const useAuth = authStore();
const route = useRoute();
async function save() {
  loading.value = true;
  const dataS = {
    id: data.value.id,
    author: useAuth.user.id,
    name: data.value.name,
    introduce: data.value.introduce,
    type: data.value.type,
  };

  if (dataS.name && dataS.introduce && dataS.type.length) {
    try {
      await useModel.update(dataS);
      useAlert.setSuccess("Sửa thành công");
      navigateTo("/admin/courses");
    } catch (error) {
      console.log(error);
    }
  } else {
    useAlert.setWarning("Bạn phải nhập đủ các tên, loại môn học và mô tả");
  }
  loading.value = false;
}

async function getApi() {
  try {
    if (route.params.id) {
      data.value = await useModel.findOne(route.params.id);
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getApi();
});

useHead({
  title: "Sửa môn học",
});
</script>

<style></style>
