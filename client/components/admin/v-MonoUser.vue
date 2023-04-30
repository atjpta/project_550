<template>
  <div
    class="w-full duration-500 hover:bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 rounded-2xl"
  >
    <div class="flex justify-between items-center">
      <!-- tác giả -->
      <div class="basis-1/3">
        <nuxt-link
          :to="`/user/${data._id}/overview`"
          class="flex items-center space-x-3 hover:text-info"
        >
          <div class="avatar">
            <div class="mask mask-squircle w-12 h-12">
              <img :src="data.avatar_url" />
            </div>
          </div>
          <div>
            <div class="font-bold">{{ data.name }}</div>
          </div>
        </nuxt-link>
      </div>

      <!-- các nút chức năng -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 pr-5">
        <div
          @click="showDataReport()"
          data-tip="Xem báo cáo"
          class="h-10 w-10 indicator flex tooltip tooltip-left lg:tooltip-top btn btn-sm btn-ghost text-primary"
        >
          <OtherVIcon icon="fa-solid fa-flag" />
          <span
            v-if="data.reports.length > 0"
            class="indicator-item mt-2 mr-2 badge badge-secondary"
            >{{ data.slReport }}</span
          >
        </div>
        <nuxtLink
          :to="`/user/${data._id}/overview`"
          data-tip="Xem chi tiết"
          class="h-10 w-10 flex tooltip tooltip-left lg:tooltip-top btn btn-sm btn-ghost text-info"
        >
          <OtherVIcon icon="fa-solid fa-eye" />
        </nuxtLink>

        <div
          data-tip="Cảnh báo người dùng"
          class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top"
        >
          <div
            :class="[loading == 'warning' ? 'loading ' : '']"
            @click="openDialogInput(warning, 'Hãy cảnh báo gì đó cho người dùng')"
            class="h-10 w-10 btn btn-sm btn-ghost text-warning"
          >
            <OtherVIcon icon="fa-solid fa-triangle-exclamation" />
          </div>
        </div>

        <div
          data-tip="Xóa người dùng"
          class="uppercase font-medium flex tooltip tooltip-left lg:tooltip-top"
        >
          <div
            :class="[loading ? 'deleteModel ' : '']"
            @click="openDialog(deleteModel)"
            class="h-10 w-10 btn btn-sm btn-ghost text-error"
          >
            <OtherVIcon icon="fa-solid fa-trash" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="showReport && data.reports.length > 0">
      <div class="divider"></div>
      <div class="ml-10">
        <div class="flex items-center justify-between font-black uppercase mb-2">
          <div class="">Người báo cáo</div>
          <div>Nội dung</div>

          <div
            data-tip="Xóa tất cả báo cáo"
            class="font-medium flex tooltip tooltip-left lg:tooltip-top"
          >
            <div
              :class="[loading == 'deleteByModel' ? 'loading ' : '']"
              @click="deleteByModel()"
              class="btn btn-sm btn-ghost text-error"
            >
              Xóa tất cả
            </div>
          </div>
        </div>
        <div>
          <div v-for="(i, n) in data.reports" :key="i._id">
            <AdminVMonoReport class="" :data="i" />
            <div v-if="n < data.reports.length - 1" class="divider my-0"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { alertStore } from "~~/stores/alert.store";
import { dialogStore } from "~~/stores/dialog.store";
import { notificationStore } from "~~/stores/notification.store";
import { reportStore } from "~~/stores/report.store";
import { routeStore } from "~~/stores/route.store";
import { userStore } from "~~/stores/user.store";

const useRouteS = routeStore();
const useReport = reportStore();
const useAlert = alertStore();
const useDialog = dialogStore();
const useNotification = notificationStore();
const useUser = userStore();
const props = defineProps({
  data: Object,
});
const showReport = ref(false);
const loading = ref("");

function showDataReport() {
  showReport.value = !showReport.value;
  if (props.data.reports.length == 0) {
    useAlert.setInfo("Người dùng này không có báo cáo nào cả!!!!!!");
  }
}

async function deleteByModel() {
  loading.value = "deleteByModel";
  try {
    await useReport.deleteByModel(props.data._id);
    await useRouteS.refreshData();
    useAlert.setSuccess("Đã xóa thành công");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = "";
  }
}

async function warning(input) {
  loading.value = "warning";
  try {
    const dataNotifi = {
      to: props.data._id,
      content: `Bạn bị cảnh báo:  ${input}`,
      type: "warning",
    };
    await await useNotification.createOne(dataNotifi);
    useAlert.setSuccess("Đã gửi cảnh báo đi thành công");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = "";
  }
}

async function deleteModel(input) {
  loading.value = "deleteModel";
  try {
    await useUser.deleteOne(props.data._id);
    useAlert.setSuccess("Đã xóa thành công");
    await useRouteS.refreshData();
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = "";
  }
}

function openDialogInput(cb, contentT) {
  useDialog.showDialogInput(
    {
      title: "Thông báo cực căng!",
      content: contentT,
      btn1: "Gửi",
      btn2: "Hủy",
    },
    cb
  );
}

function openDialog(cb) {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "Bạn chắc chắn muốn xóa không?",
      btn1: "Gửi",
      btn2: "Hủy",
    },
    cb
  );
}
</script>
