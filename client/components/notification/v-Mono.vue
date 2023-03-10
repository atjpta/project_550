<template>
  <div>
    <div class="flex justify-between">
      <div
        @click="goto()"
        :class="borderNotification"
        class="bg-gradient-to-r flex ml-5 mr-0 btn-ghost py-2 cursor-pointer border-l-4 border-0 w-full"
      >
        <div class="mr-5 flex items-center">
          <div v-if="data.type == 'info'">
            <OtherVIcon
              class-icon="text-2xl text-info ml-3"
              icon="fa-solid fa-circle-info"
            />
          </div>
          <div v-if="data.type == 'warning'">
            <OtherVIcon
              class-icon="text-2xl text-warning ml-3"
              icon="fa-solid fa-triangle-exclamation"
            />
          </div>
          <div v-if="data.type == 'error'">
            <OtherVIcon
              class-icon="text-2xl text-error ml-3"
              icon="fa-solid fa-circle-exclamation"
            />
          </div>
        </div>
        <div class="flex justify-between w-full">
          <div class="">
            <div>
              {{ data.content }}
            </div>
            <div class="text-sm italic">
              {{ data.createdAt }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <div class="w-16">
          <div @click="removeView()" v-if="!data.view" class="btn btn-ghost no-animation">
            <OtherVIcon class-icon="text-xl text-primary" icon="fa-solid fa-circle" />
          </div>
          <div
            @click="deleteNotification()"
            :class="[loading ? 'loading' : '']"
            class="btn btn-ghost"
          >
            <OtherVIcon class-icon="text-xl text-error " icon="fa-solid fa-x" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { notificationStore } from "~~/stores/notification.store";

const props = defineProps({
  data: Object,
});
const useAuth = authStore();
const useNotification = notificationStore();
const loading = ref(false);
const borderNotification = computed(() => {
  let classBorder = "border-info from-info/20";
  if (props.data.type == "warning") {
    classBorder = "border-warning from-warning/20";
  }
  if (props.data.type == "error") {
    classBorder = "border-error from-error/20";
  }
  return classBorder;
});

async function goto() {
  await removeView();
  navigateTo(props.data.url);
}

async function removeView() {
  try {
    const data = {
      id: props.data.id,
      view: true,
    };
    await useNotification.update(data);
    await useNotification.findByMy(useAuth.user.id);
  } catch (error) {
    console.log(error);
    console.log("lỗi goto useNotification");
  }
}

async function deleteNotification() {
  try {
    loading.value = true;
    await useNotification.deleteOne(props.data.id);
    await useNotification.findByMy(useAuth.user.id);
  } catch (error) {
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
