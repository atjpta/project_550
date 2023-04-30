<template>
  <div>
    <div class="glass rounded-2xl h-20 p-2">
      <div class="flex justify-between">
        <nuxtLink
          class="hover:text-sky-500 hover:scale-110 duration-500"
          :to="`/user/${data._id}/overview`"
        >
          <!-- tác giả -->
          <div class="flex">
            <div class="avatar">
              <div class="w-16 h-16 rounded-full">
                <img :src="data.avatar_url" />
              </div>
            </div>
            <div class="text-2xl mx-3 font-bold">
              <div class="overflow-hidden text-clip h-8">
                {{ data.name }}
              </div>
              <div class="text-sm space-x-3">
                <div class="tooltip" data-tip="Điểm người dùng">
                  <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
                  {{ data.total_count }}
                </div>
                <div class="tooltip" data-tip="Số người theo dõi">
                  <OtherVIcon class-icon="text-info" icon="fa-solid fa-user" />
                  {{ data.followsCount }}
                </div>
              </div>
            </div>
          </div>
        </nuxtLink>
        <!-- phần tùy chọn cho người đọc -->
        <div v-if="!isAuthor" class="dropdown dropdown-end z-10">
          <label tabindex="0" class="btn btn-ghost">
            <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
          </label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li @click="openDialogReport()" class="hover-bordered">
              <a>
                <div>
                  <OtherVIcon icon="fa-solid fa-flag" />
                  Báo cáo
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
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
  if (useAuth.user && props.data._id) {
    return useAuth.user.id == props.data._id;
  }
});

function openDialogReport() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialogInput(
      {
        title: "Thông báo cực căng!",
        content: "Người dùng này có vấn để?!",
        btn1: "Gửi",
        btn2: "Hủy",
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
