<template>
  <div>
    <transition name="bounce">
      <div
        class="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/0 rounded-2xl p-5"
      >
        <div class="flex">
          <!-- ảnh series -->
          <div class="mx-auto min-w-max w-32 min-h-max h-32 mr-3">
            <img
              class="rounded-2xl w-32 h-32"
              :src="data.series[0].image_cover_url"
              alt=""
            />
          </div>
          <div class="w-full">
            <div class="flex justify-between flex-col-reverse lg:flex-row">
              <div>
                <nuxtLink
                  class="hover:text-sky-500 hover:scale-110 duration-500"
                  :to="`/series/${data.series[0]._id}`"
                >
                  <!-- tên team -->
                  <div class="text-2xl font-bold uppercase">
                    {{ data.series[0].name }}
                  </div>
                </nuxtLink>
              </div>

              <!-- phần tùy chọn cho người đọc -->
              <div
                v-if="!isAuthor && useAuth.isUserLoggedIn"
                class="dropdown dropdown-end"
              >
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
                        bỏ lưu chuỗi bài viết
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <!-- ảnh bìa và tiêu đề -->
            <div class="text-xl">{{ data.series[0].introduce }}</div>
            <!-- tag -->
            <div class="mt-4 flex">
              <div v-for="i in list_tag" :key="i._id" class="">
                <nuxt-link
                  :to="`/tag/${i._id}/post`"
                  class="btn btn-outline btn-sm mr-1 mt-1"
                  >{{ "#" + i.name }}</nuxt-link
                >
              </div>
            </div>
          </div>
        </div>

        <!-- các trạng thái của team  -->
        <div class="flex space-x-5 mt-2">
          <div class="tooltip" data-tip="điểm series">
            <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
            {{ data.valScore }}
          </div>
          <div class="tooltip" data-tip="số bài viết">
            <OtherVIcon class-icon="text-info" icon="fa-solid fa-file-lines" />
            {{ data.post[0]?.count || 0 }}
          </div>
        </div>
      </div>
    </transition>
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
const list_tag = computed(() => {
  let list = [];
  if (props.data.listtag?.length > 0) {
    props.data.listtag.forEach((e) => {
      e.forEach((ee) => {
        check(list, ee);
      });
    });
  }
  return list;
});

function check(list, tag) {
  let mark = 0;
  list.forEach((e) => {
    if (e._id == tag._id) {
      mark = 1;
      return;
    }
  });
  if (mark == 0) {
    list.push(tag);
  }
}

const isAuthor = computed(() => {
  if (useAuth.user && props.data.author) {
    return useAuth.user.id == props.data.author[0]._id;
  }
});

const valVote = computed(() => {
  if (props.data.vote) {
    let val = props.data.vote?.val;
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
      content: "bạn chắc chắn muốn xóa bài viết khỏi danh sách lưu trữ",
      btn1: "ok",
      btn2: "hủy",
    },
    () => {
      cb();
    }
  );
}
</script>
