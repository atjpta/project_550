<template>
  <div>
    <div
      class="indicator w-full hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-5">
      <div>
        <!-- phần đầu -->
        <div class="flex justify-end">
          <!-- phần tùy chọn cho người đọc -->
          <div class="dropdown dropdown-left indicator-item mr-10 mt-10">
            <label tabindex="0" class="btn btn-ghost">
              <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
            </label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <div v-if="!isAuthor">
                <li @click="openDialogReport()" class="hover-bordered">
                  <a>
                    <div>
                      <OtherVIcon icon="fa-solid fa-flag" />
                      báo cáo
                    </div>
                  </a>
                </li>
              </div>

              <div v-if="isAuthor">
                <li v-if="data.series" @click="openDialogRemoveSeries()" class="hover-bordered">
                  <a>
                    <div>
                      <OtherVIcon class-icon="text-warning" icon="fa-solid fa-xmark" />
                      xóa khỏi chuỗi bài viết
                    </div>
                  </a>
                </li>
                <li v-if="!data.series" @click="openDialogAddSeries()" class="hover-bordered">
                  <a>
                    <div>
                      <OtherVIcon class-icon="text-success" icon="fa-solid fa-plus" />
                      thêm vào
                    </div>
                  </a>
                </li>
                <li @click="navigateTo(`/post/edit/${data._id}`)" class="hover-bordered">
                  <a>
                    <div>
                      <OtherVIcon class-icon="text-primary" icon="fa-solid fa-pen-to-square" />
                      sửa
                    </div>
                  </a>
                </li>
                <li @click="openDialogDelete()" class="hover-bordered">
                  <a>
                    <div>
                      <OtherVIcon class-icon="text-error" icon="fa-solid fa-trash-can" />
                      xóa
                    </div>
                  </a>
                </li>
              </div>
            </ul>
          </div>
        </div>
        <!-- ảnh bìa và tiêu đề -->
        <div @click="goReadPost()" class="cursor-pointer">
          <!-- <div class="overflow-hidden rounded-2xl my-2 mx-auto">
            <img
              class="rounded-2xl hover:scale-105 duration-500"
              :src="data.image_cover_url"
              alt=""
            />
          </div> -->
          <div class="font-bold text-4xl hover:text-info duration-500">
            {{ data.title }}
          </div>
        </div>
        <!-- tag -->
        <div class="mt-4 flex flex-wrap">
          <div v-for="i in data.tag" :key="i._id" class="">
            <nuxt-link :to="`/tag/${i._id}`" class="btn btn-outline btn-sm mr-1 mt-1">{{
              "#" + i.name
            }}</nuxt-link>
          </div>
        </div>
        <!-- status
        <div v-if="data?.status[0].name == 'private'">
          <div class="italic font-semibold">
            nhóm riêng tư
            <div class="tooltip" data-tip="chuyển sang công khai để người khác thấy">
              <div class="btn-xs btn btn-outline btn-info rounded-full text-xs scale-75">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
        </div> -->
        <!-- các trạng thái của bài viết  -->
        <div class="flex space-x-5 mt-2">
          <div class="tooltip" data-tip="điểm bài viết">
            <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
            {{ valVote }}
          </div>
          <div class="tooltip" data-tip="lượt bình luận">
            <OtherVIcon class-icon="text-primary" icon="fa-solid fa-comments" />
            {{ data.comment.length > 0 ? data.comment[0].count : "0" }}
          </div>
          <div class="tooltip" data-tip="lượt xem">
            <OtherVIcon class-icon="text-info" icon="fa-solid fa-eye" />
            {{ data.view }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { dialogStore } from "~~/stores/dialog.store";
import { notificationStore } from "~~/stores/notification.store";
import { postStore } from "~~/stores/post.store";
import { reportStore } from "~~/stores/report.store";
import { routeStore } from "~~/stores/route.store";
import { seriesStore } from "~~/stores/series.store";

const props = defineProps({
  data: Object,
});
const useReport = reportStore();
const userouteS = routeStore();
const useDialog = dialogStore();
const useAuth = authStore();
const usePost = postStore();
const useSeries = seriesStore();
const route = useRoute();
const useNotification = notificationStore();

const isAuthor = computed(() => {
  if (useAuth.user && props.data.author) {
    return useAuth.user.id == props.data.author[0]._id;
  }
});

const valVote = computed(() => {
  if (props.data.vote) {
    let val = props.data.vote[0]?.val;
    if (val != undefined) {
      if (val > 0) {
        return "+" + val;
      } else if (val == 0) {
        return 0;
      } else return val;
    }
  }
  return 0;
});

function openDialogDelete() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn xóa bài viết?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        await usePost.deleteOne(props.data._id);
        resetData();
      }
    );
  }
}
function openDialogRemoveSeries() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn xóa bài viết khỏi series này?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        await usePost.updateSeries(props.data._id);
        resetData();
      }
    );
  }
}

function openDialogAddSeries() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "nhóm và chuỗi bài viết của bài viết sẽ bị thay đổi",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        const data = {
          series: route.params.id,
        };

        const dataNotification = {
          author: useAuth.user.id,
          model: route.params.id,
          content: `bạn có bài viết mới trong series "${useSeries.series.name}"`,
          url: route.fullPath,
          type: "info",
        };

        if (useSeries.series.team.length > 0) {
          data.team = useSeries.series.team[0]._id;
        }
        await usePost.updateSeries(props.data._id, data);
        await useNotification.create(dataNotification);

        resetData();
      }
    );
  }
}

async function resetData() {
  await usePost.findBySeries(route.params.id);
  await usePost.findByNoSeries(useAuth.user.id);
  await useSeries.findOne(route.params.id);
}

async function goReadPost() {
  await usePost.update({
    id: props.data._id,
    view: props.data.view + 1,
  });
  navigateTo(`/post/${props.data._id}`);
}
function openDialogReport() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialogInput(
      {
        title: "Thông báo cực căng!",
        content: "Bài viết này có vấn để?!",
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
  } else {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn cần đăng nhập để tạo bài viết",
        btn1: "đăng nhập",
        btn2: "hủy",
      },
      () => {
        useRouteS.redirectedFrom = useRoute().fullPath;
        return navigateTo("/auth/signin");
      }
    );
  }
}
</script>
