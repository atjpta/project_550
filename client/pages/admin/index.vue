<template>
  <div>
    <span
      class="italic before:h-[98%] before:my-auto py-1 before:block before:absolute before:-inset-1 before:-skew-y-3 before:-skew-x-12 before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative inline-block">
      <span class="relative text-white text-3xl font-black px-5">Trang admin</span>
    </span>
    <!-- <SearchVInput /> -->
    <div class="form-control mt-3">
      <div class="input-group">
        <input v-model="useReport.key" type="text" placeholder="Tìm kiếm…"
          class="input lg:input-md input-sm input-bordered lg:w-1/2 w-3/5" />
        <button @click="getApi()" class="btn btn-square lg:btn-md btn-sm">
          <OtherVIcon icon="fa-solid fa-magnifying-glass" />
        </button>
      </div>
    </div>
    <div class="flex flex-wrap mt-3">
      <div v-for="i in menuAdmin" :key="i">
        <div class="indicator">
          <nuxtLink :to="'/admin' + i.url" class="btn btn-sm btn-outline mr-1 mb-1">
            <div>
              {{ i.title }}
            </div>
            <div v-if="i.slReport" class="indicator-item mr-2">
              <div :data-tip="` ${i.slReport} ${i.title} có báo cáo`"
                class="badge badge-secondary border-none tooltip tooltip-left md:tooltip-top text-primary">
                {{ i.slReport }}
              </div>
            </div>
          </nuxtLink>
        </div>
      </div>
      <div v-for="i in menuAdmin2" :key="i">
        <nuxtLink :to="'/admin' + i.url" class="flex space-x-1 btn btn-sm btn-outline mr-1 mb-1">
          <div>
            {{ i.title }}
          </div>
        </nuxtLink>
      </div>
    </div>

    <div class="mt-3 space-y-5" v-if="loadingSkeleton">
      <div v-for="i in 7" :key="i">
        <AdminVSkeleton />
      </div>
    </div>

    <NuxtPage v-else />
  </div>
</template>

<script setup>
import { alertStore } from "~~/stores/alert.store";
import { authStore } from "~~/stores/auth.store";
import { userStore } from "~~/stores/user.store";
import { reportStore } from "~~/stores/report.store";

const useUser = userStore();
const useAuth = authStore();
const route = useRoute();
const useAlert = alertStore();
const useReport = reportStore();
const loadingSkeleton = ref(false);
const menuAdmin = ref([
  {
    title: "bài viết",
    url: "/post",
    slReport: computed(() => {
      let sl = 0;
      useReport.list_post.forEach((e) => {
        if (e.slReport > 0) {
          sl++;
        }
      });
      return sl;
    }),
  },
  {
    title: "chuỗi bài viết",
    url: "/series",
    slReport: computed(() => {
      let sl = 0;
      useReport.list_series.forEach((e) => {
        if (e.slReport > 0) {
          sl++;
        }
      });
      return sl;
    }),
  },
  {
    title: "câu hỏi",
    url: "/question",
    slReport: computed(() => {
      let sl = 0;
      useReport.list_question.forEach((e) => {
        if (e.slReport > 0) {
          sl++;
        }
      });
      return sl;
    }),
  },
  {
    title: "chủ đề",
    url: "/topic",
    slReport: computed(() => {
      let sl = 0;
      useReport.list_topic.forEach((e) => {
        if (e.slReport > 0) {
          sl++;
        }
      });
      return sl;
    }),
  },
  {
    title: "người dùng",
    url: "/user",
    slReport: computed(() => {
      let sl = 0;
      useReport.list_user.forEach((e) => {
        if (e.slReport > 0) {
          sl++;
        }
      });
      return sl;
    }),
  },
  {
    title: "nhóm",
    url: "/team",
    slReport: computed(() => {
      let sl = 0;
      useReport.list_team.forEach((e) => {
        if (e.slReport > 0) {
          sl++;
        }
      });
      return sl;
    }),
  },
  {
    title: "thẻ tag",
    url: "/tag",
    slReport: computed(() => {
      let sl = 0;
      useReport.list_tag.forEach((e) => {
        if (e.slReport > 0) {
          sl++;
        }
      });
      return sl;
    }),
  },
]);

const menuAdmin2 = ref([
  {
    title: "môn học",
    url: "/courses",
  },
  {
    title: "loại môn học",
    url: "/typecourse",
  },
]);

async function getApi() {
  loadingSkeleton.value = true;
  try {
    if (useAuth.user) {
      if (!useUser.user.id) {
        await useUser.findOne(useAuth.user.id);
        if (!useUser.isAdmin) {
          useAlert.setWarning("bạn không có quyền truy cập trang này");
          return navigateTo(route.redirectedFrom);
        }
      }
    } else {
      useAlert.setWarning("bạn không có quyền truy cập trang này");
      return navigateTo(route.redirectedFrom);
    }
    useReport.getApi();
    loadingSkeleton.value = false;
  } catch (error) {
    console.log(error);
  }
}

definePageMeta({
  middleware: "admin",
});

onMounted(() => {
  getApi();
});
</script>

<style></style>
