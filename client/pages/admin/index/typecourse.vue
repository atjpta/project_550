<template>
  <div class="my-5">
    <div class="flex justify-end">
      <div @click="openDialogCreate()" class="btn btn-success btn-outline btn-sm">
        tạo loại môn học
      </div>
    </div>

    <!-- loadingSkeleton -->

    <div v-if="loadingSkeleton" class="space-y-5">
      <div v-for="i in size" :key="i">
        <AdminVSkeleton />
      </div>
    </div>
    <div v-else>
      <div class="space-y-3 mt-5" v-if="useTypeCourse.list[0]">
        <div v-for="(i, n) in useTypeCourse.list" :key="i._id">
          <AdminVMonoTypeCourse :data="i" />
          <div v-if="n < useTypeCourse.list.length - 1" class="divider"></div>
        </div>
      </div>
      <div v-else>
        <div class="text-center text-2xl my-10">Bạn chưa có loại bài viết nào cả !?</div>
      </div>
    </div>
    <!-- btn chuyển trang -->

    <div v-if="useTypeCourse.list[0]" class="form-control mx-auto w-fit">
      <div class="input-group lg:input-group-md input-group-sm">
        <button @click="goToPre()" :disabled="selectPage == 1" class="btn lg:btn-md btn-sm">
          <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-left" />
        </button>
        <select v-model="selectPage" @change="goToPage()" class="select select-bordered lg:select-md select-sm">
          <option :value="i" :disabled="i == selectPage" v-for="i in maxPage" :key="i">
            trang {{ i }}
          </option>
        </select>
        <button @click="goToNext()" :disabled="selectPage == maxPage" class="btn btn-sm lg:btn-md text-2xl">
          <OtherVIcon class-icon="text-xl" icon="fa-solid fa-angle-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { routeStore } from "~~/stores/route.store";
import { dialogStore } from "~~/stores/dialog.store";
import { alertStore } from "~~/stores/alert.store";
import { typecourseStore } from "~~/stores/typecourse.store";
import { authStore } from "~/stores/auth.store";

const useDialog = dialogStore();
const loadingSkeleton = ref(false);
const useRouteS = routeStore();
const useAlert = alertStore();
const useAuth = authStore();
const useTypeCourse = typecourseStore();

const size = 5;
const maxPage = computed(() => {
  let max = 0;
  max = Math.ceil(useTypeCourse.maxLength / size);
  return max;
});
const selectPage = ref(1);

async function goToPre() {
  selectPage.value -= 1;
  await getApiPage(selectPage.value);
}

async function goToNext() {
  selectPage.value += 1;
  await getApiPage(selectPage.value);
}

async function goToPage() {
  await getApiPage(selectPage.value);
}

async function getApiPage(page) {
  loadingSkeleton.value = true;
  try {
    await useTypeCourse.findPerPage(page, size);

    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

async function getApi(page) {
  loadingSkeleton.value = true;
  try {
    if (page) {
      selectPage.value = page;
    }
    await useTypeCourse.findPerPage(page ?? selectPage.value, size);
    await useTypeCourse.getMaxLength();
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

function openDialogCreate() {
  useDialog.showDialogInput(
    {
      title: "Tạo loại môn học",
      content: "nhập tên loại môn học",
      btn1: "tạo",
      btn2: "hủy",
    },
    async (input) => {
      try {
        await useTypeCourse.create({
          author: useAuth.user.id,
          name: input,
        });
        await getApi(1);
        useAlert.setSuccess("Tạo thành công");
      } catch (error) {
        console.log(error);
        useAlert.setError("lỗi server");
      }
    }
  );
}
onMounted(() => {
  useRouteS.cb = getApi;
  getApi(1);
});
</script>

<style></style>
