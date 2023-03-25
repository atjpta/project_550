<template>
  <div
    class="bg-gradient-to-r from-primary/10 via-primary/5 to-pink-500/5 rounded-2xl border-l-4 border-primary p-5"
  >
    <div class="flex justify-between">
      <div class="text-xl font-bold uppercase"># {{ data.tags[0].name }}</div>
      <!-- phần tùy chọn cho người đọc -->
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="flex justify-end">
          <div class="btn btn-ghost btn-primary">
            <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
          </div>
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li class="hover-bordered">
            <a>
              <div @click="openDialogReport()">
                <OtherVIcon icon="fa-solid fa-flag" />
                báo cáo Nhóm
              </div>
            </a>
          </li>
          <li class="hover-bordered">
            <a>
              <div @click="openDialogRemoveSave(removeSave)">
                <OtherVIcon icon="fa-solid fa-x" />
                bỏ lưu tag
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="indent-8 h-12 overflow-hidden">
      {{ data.tags[0].introduce || "chưa có mô tả về tag này" }}
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
import { followStore } from "~~/stores/follow.store";
import { postStore } from "~~/stores/post.store";
import { routeStore } from "~~/stores/route.store";
import { seriesStore } from "~~/stores/series.store";

const props = defineProps({
  data: Object,
});
const useFollow = followStore();
const useDialog = dialogStore();
const useAuth = authStore();
const usePost = postStore();
const useSeries = seriesStore();
const useRouteS = routeStore();
const removeSave = async () => {
  try {
    await useFollow.deleteOne(props.data._id);
    await useRouteS.refreshData();
  } catch (error) {
    console.log(erorr);
    console.log("lỗi save");
  }
};

function openDialogRemoveSave(cb) {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "bạn chắc chắn muốn xóa tag này ra khỏi danh sách lưu trữ",
      btn1: "ok",
      btn2: "hủy",
    },
    () => {
      cb();
    }
  );
}
</script>

<style></style>
