<template>
  <div class="rounded-2xl py-5 lg:pl-5">
    <div class="lg:flex justify-evenly">
      <!-- ảnh -->
      <div class="w-64 mx-auto lg:mx-0">
        <img
          class="bg-black/50 h-64 w-64 rounded-full"
          :src="useUser.overview.avatar_url"
          alt=""
        />
        <div v-if="!isSelf">
          <div v-if="!useFollow.follow" class="text-center m-5">
            <div
              @click="addFollow()"
              :class="[loading ? 'loading' : '']"
              class="btn btn-outline btn-primary"
            >
              theo dõi
            </div>
          </div>
          <div v-else class="text-center m-5">
            <div
              @click="removeFollow()"
              :class="[loading ? 'loading' : '']"
              class="btn btn-outline btn-error"
            >
              hủy theo dõi
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 lg:mt-0 px-5 lg:w-96">
        <!-- tên -->
        <div class="text-3xl font-bold mb-5">
          <div class="text-3xl font-semibold">{{ useUser.overview.name }}</div>
        </div>

        <!--giới thiệu -->
        <div class="">
          {{ useUser.overview.introduce || "chưa có lời giới thiệu" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";
import { authStore } from "~~/stores/auth.store";
import { followStore } from "~~/stores/follow.store";
const useUser = userStore();
const useAuth = authStore();
const useFollow = followStore();
const route = useRoute();
const loading = ref(false);
const isSelf = computed(() => {
  if (useAuth.user.id == useUser.overview._id) {
    return true;
  }
  return false;
});

async function addFollow() {
  try {
    loading.value = true;
    const data = {
      user: useUser.overview._id,
      follow: useAuth.user.id,
    };
    await useFollow.create(data);
    await getApi();
  } catch (error) {
    console.log(erorr);
    console.log("lỗi addFollow");
  } finally {
    loading.value = false;
  }
}

async function removeFollow() {
  try {
    loading.value = true;
    await useFollow.deleteOne(useFollow.follow.id);
    await getApi();
  } catch (error) {
    console.log(erorr);
    console.log("lỗi removeFollow");
  } finally {
    loading.value = false;
  }
}

async function getApi() {
  await useFollow.findByFollow(route.params.id, useAuth.user.id);
}

onMounted(() => {
  getApi();
});
</script>

<style></style>
