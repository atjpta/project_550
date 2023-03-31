<template>
  <div
    class="hover:bg-gradient-to-l bg-gradient-to-r from-primary/10 via-primary/5 to-pink-500/5 rounded-2xl border-l-4 border-primary p-5">
    <div class="flex justify-between">
      <div class="text-xl font-bold uppercase"># {{ data.name }}</div>
      <!-- phần tùy chọn cho người đọc -->
      <div v-if="isAuthor" class="dropdown dropdown-end z-10 h-5">
        <label tabindex="0" class="btn btn-ghost">
          <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
        </label>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li @click="openDialogReport()" class="hover-bordered">
            <a>
              <div>
                <OtherVIcon icon="fa-solid fa-flag" />
                báo cáo
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <nuxtLink :to="`/tag/${data._id}/post`">
      <div class="text-center">
        <div class="btn text-info btn-ghost btn-sm">xem thêm</div>
      </div>
    </nuxtLink>
    <div class="text-sm italic lowercase text-right opacity-75">
      {{ data.total_count }} lần sử dụng
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { dialogStore } from "~~/stores/dialog.store";
import { reportStore } from "~~/stores/report.store";

const props = defineProps({
  data: Object,
});
const useReport = reportStore();
const useDialog = dialogStore();
const useAuth = authStore();

const isAuthor = computed(() => {
  if (useAuth.user && props.data.author) {
    return useAuth.user.id == props.data.author;
  }
});

function openDialogReport() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialogInput(
      {
        title: "Thông báo cực căng!",
        content: "Thẻ tag này có vấn để?!",
        btn1: "gửi",
        btn2: "hủy",
      },
      async (input) => {
        await useReport.create({
          author: useAuth.user.id,
          content: input,
          model: props.data._id,
        });
      }
    );
  }
}
</script>

<style></style>
