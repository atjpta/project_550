<template>
  <div class="rounded-2xl py-5 lg:pl-5">
    <div class="lg:flex justify-evenly">
      <!-- ảnh -->
      <div class="w-64 mx-auto lg:mx-0">
        <UploadVAvatar :manager="manager" />
      </div>
      <div class="mt-5 lg:mt-0 px-5 lg:w-96">
        <div class="mb-5">
          <!-- tên -->
          <div class="text-3xl font-bold">
            <div v-if="!openEditName" class="flex space-x-2">
              <div class="text-3xl font-semibold">{{ useUser.user.name }}</div>
              <div v-if="manager" @click="openEditNameF()" class="btn btn-ghost text-primary btn-sm tooltip flex w-fit"
                data-tip="sửa tên">
                <OtherVIcon icon="fa-solid fa-pen-to-square" />
              </div>
            </div>
            <input v-if="openEditName" v-model="name" type="text" class="input input-primary w-full" />
          </div>
          <div v-if="openEditName" class="flex space-x-1">
            <div @click="updateName()" :class="loading ? 'loading' : ''" class="btn btn-primary btn-sm mt-1">
              lưu
            </div>
            <div @click="closeEditNameF()" class="btn btn-ghost text-error btn-sm mt-1">
              hủy
            </div>
          </div>
        </div>

        <!-- chỉnh lời giới thiệu -->
        <div>
          <div>
            <div v-if="!openEditIntroduce" class="">
              <div class="">
                {{ useUser.user.introduce || "chưa có lời giới thiệu" }}
              </div>
              <div v-if="manager" @click="openEditIntroduceF()"
                class="btn btn-ghost text-primary btn-sm tooltip flex w-fit" data-tip="sửa lời giới thiệu">
                <OtherVIcon icon="fa-solid fa-pen-to-square" />
              </div>
            </div>

            <!-- xs -->
            <textarea v-if="openEditIntroduce" v-model="introduce" rows="5" placeholder="nhập lời giới thiệu"
              class="textarea textarea-xs w-full textarea-primary h-20"></textarea>
          </div>
          <div v-if="openEditIntroduce" class="flex space-x-1">
            <div @click="updateIntroduce()" :class="loading ? 'loading' : ''" class="btn btn-primary btn-sm mt-1">
              lưu
            </div>
            <div @click="closeEditIntroduceF()" class="btn btn-ghost text-error btn-sm mt-1">
              hủy
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userStore } from "~~/stores/user.store";
const props = defineProps({
  manager: Boolean,
});
const useUser = userStore();
const name = ref("");
const openEditName = ref(false);
const introduce = ref("");
const openEditIntroduce = ref(false);
const loading = ref(false);
function openEditNameF() {
  openEditName.value = true;
  name.value = useUser.user.name;
}

function closeEditNameF() {
  openEditName.value = false;
  name.value = "";
}

async function updateName() {
  try {
    loading.value = true;
    const data = {
      id: useUser.user.id,
      name: name.value,
    };
    await useUser.update(data);
    await useUser.findOne(useUser.user.id);
  } catch (error) {
  } finally {
    loading.value = false;
    closeEditNameF();
  }
}

function openEditIntroduceF() {
  openEditIntroduce.value = true;
  introduce.value = useUser.user.introduce;
}

function closeEditIntroduceF() {
  openEditIntroduce.value = false;
  introduce.value = "";
}

async function updateIntroduce() {
  try {
    loading.value = true;
    const data = {
      id: useUser.user.id,
      introduce: introduce.value,
    };
    await useUser.update(data);
    await useUser.findOne(useUser.user.id);
  } catch (error) {
  } finally {
    loading.value = false;
    closeEditIntroduceF();
  }
}
</script>

<style></style>
