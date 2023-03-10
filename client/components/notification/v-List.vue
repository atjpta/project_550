<template>
  <div class="z-30">
    <div class="indicator">
      <span v-if="value > 0" class="indicator-item badge badge-secondary mt-3 mr-3">{{
        value
      }}</span>
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost text-2xl">
          <OtherVIcon icon="fa-solid fa-bell" />
        </label>
        <ul
          tabindex="0"
          class="dropdown-content rounded-2xl shadow bg-base-100 w-72 sm:w-96"
        >
          <div v-if="useNotification.list_notification[0]">
            <div class="text-end">
              <div
                @click="markAll()"
                :class="[loading ? 'loading' : '']"
                class="btn btn-sm btn-ghost italic"
              >
                đánh dấu tất cả đã đọc
              </div>
            </div>
            <div class="space-y-3">
              <li v-for="i in useNotification.list_notification" :key="i.id">
                <NotificationVMono :data="i" />
              </li>
            </div>
            <div class="text-end">
              <div
                @click="openDialogDeleteAllNotification()"
                :class="[loading ? 'loading' : '']"
                class="btn btn-sm btn-ghost italic"
              >
                xóa tất cả thông báo
              </div>
            </div>
          </div>
          <div v-else>
            <div class="text-center text-2xl my-10">Bạn không có thông báo nào cả !?</div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { notificationStore } from "~~/stores/notification.store";
import { dialogStore } from "~~/stores/dialog.store";

const useAuth = authStore();
const useNotification = notificationStore();
const loading = ref(false);
const useDialog = dialogStore();
const value = computed(() => {
  let sl = 0;
  useNotification.list_notification.forEach((e) => {
    if (!e.view) {
      sl += 1;
    }
  });
  return sl;
});

async function getApi() {
  if (useAuth.user) {
    await useNotification.findByMy(useAuth.user.id);
  }
}

function openDialogDeleteAllNotification() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn xóa tất cả thông báo?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        try {
          loading.value = true;
          await useNotification.deleteByMy(useAuth.user.id);
          await useNotification.findByMy(useAuth.user.id);
        } catch (error) {
          console.log(error);
        } finally {
          loading.value = false;
        }
      }
    );
  }
}

async function markAll() {
  try {
    loading.value = true;
    await useNotification.updateMarkAllByUser(useAuth.user.id);
    await useNotification.findByMy(useAuth.user.id);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  useAuth.loadAuthState();
  getApi();
});
</script>

<style></style>
