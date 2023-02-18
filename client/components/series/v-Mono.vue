<template>
  <div>
    <transition name="bounce">
      <div class="bg-base-200 rounded-2xl my-5 p-5">
        <div class="flex">
          <!-- ảnh series -->
          <div class="mx-auto min-w-max w-32 min-h-max h-32 mr-3">
            <img class="rounded-2xl w-32 h-32" :src="data.image_cover_url" alt="" />
          </div>
          <div class="w-full">
            <div class="flex justify-between flex-col-reverse lg:flex-row">
              <div>
                <nuxtLink
                  class="hover:text-sky-500 hover:scale-110 duration-500"
                  :to="`/series/${data._id}`"
                >
                  <!-- tên team -->
                  <div class="text-2xl font-bold uppercase">
                    {{ data.name }}
                  </div>
                </nuxtLink>
              </div>
              <!-- edit cho tác giả -->
              <div v-if="isAuthor">
                <div class="space-x-2 flex justify-end">
                  <nuxtLink
                    :to="`/series/edit/${data._id}`"
                    class="tooltip"
                    data-tip="sửa series"
                  >
                    <div class="btn btn-outline btn-primary">
                      <OtherVIcon icon="fa-solid fa-pen-to-square" />
                    </div>
                  </nuxtLink>

                  <div class="tooltip" data-tip="xóa series">
                    <div @click="openDialogDelete()" class="btn btn-outline btn-error">
                      <OtherVIcon icon="fa-solid fa-trash-can" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- phần tùy chọn cho người đọc -->
              <div
                v-if="!isAuthor && useAuth.isUserLoggedIn"
                class="dropdown dropdown-end z-10"
              >
                <label tabindex="0" class="flex justify-end">
                  <div class="btn btn-outline btn-primary">
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
                      <div @click="openDialogReport()">
                        <OtherVIcon icon="fa-solid fa-bookmark" />
                        Lưu bài viết
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <!-- ảnh bìa và tiêu đề -->
            <div class="text-xl">{{ data.introduce }}</div>
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
        <div class="flex justify-around mt-2">
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
import { postStore } from "~~/stores/post.store";
import { seriesStore } from "~~/stores/series.store";

const props = defineProps({
  data: Object,
});

const useDialog = dialogStore();
const useAuth = authStore();
const usePost = postStore();
const useSeries = seriesStore();

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

function openDialogDelete() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn xóa series này?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        await useSeries.deleteOne(props.data._id);
        await useSeries.findAll();
      }
    );
  }
}
</script>
