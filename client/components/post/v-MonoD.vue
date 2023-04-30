<template>
  <div>
    <transition name="bounce">
      <div
        :class="data.pins ? 'border-l-4 border-info' : ''"
        class="w-full hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-5"
      >
        <div>
          <!-- phần đầu -->
          <div class="flex justify-end">
            <!-- phần tùy chọn cho người đọc -->
            <div class="dropdown dropdown-left">
              <label tabindex="0" class="btn btn-ghost">
                <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
              </label>
              <ul
                tabindex="0"
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <div v-if="!isAuthor">
                  <li @click="openDialogReport()" class="hover-bordered">
                    <a>
                      <div>
                        <OtherVIcon icon="fa-solid fa-flag" />
                        Báo cáo
                      </div>
                    </a>
                  </li>
                </div>
                <!-- edit cho tác giả -->
                <div v-if="isAuthor">
                  <li v-if="!data.pins" @click="openDialogPins()" class="hover-bordered">
                    <a>
                      <div>
                        <OtherVIcon
                          class-icon="rotate-45 text-info"
                          icon="fa-solid fa-thumbtack"
                        />
                        Ghim
                      </div>
                    </a>
                  </li>
                  <li v-else @click="openDialogDeletePins()" class="hover-bordered">
                    <a>
                      <div>
                        <OtherVIcon
                          class-icon="rotate-45 text-error"
                          icon="fa-solid fa-thumbtack"
                        />
                        Hủy ghim
                      </div>
                    </a>
                  </li>
                  <li
                    @click="navigateTo(`/post/edit/${data._id}`)"
                    class="hover-bordered"
                  >
                    <a>
                      <div>
                        <OtherVIcon
                          class-icon="text-primary"
                          icon="fa-solid fa-pen-to-square"
                        />
                        Sửa
                      </div>
                    </a>
                  </li>
                  <li @click="openDialogDelete()" class="hover-bordered">
                    <a>
                      <div>
                        <OtherVIcon
                          class-icon="text-error"
                          icon="fa-solid fa-trash-can"
                        />
                        Xóa
                      </div>
                    </a>
                  </li>
                </div>
              </ul>
            </div>
          </div>
          <!-- ảnh bìa và tiêu đề -->
          <div @click="goReadPost()" class="cursor-pointer">
            <div class="hover:text-info">
              <img
                v-if="data.image_cover_url"
                class="rounded-2xl my-2 lg:h-[70vh]"
                :src="data.image_cover_url"
                alt=""
              />
              <div class="font-medium text-2xl">{{ data.title }}</div>
            </div>
          </div>
          <!-- tag -->
          <div class="mt-4 flex flex-wrap">
            <div
              v-for="i in data.tag"
              :key="i._id"
              class="btn btn-ghost bg-base-100/50 btn-sm mr-1 mt-1"
            >
              {{ "#" + i.name }}
            </div>
          </div>
          <!-- các trạng thái của bài viết  -->
          <div class="flex space-x-5 mt-2">
            <div class="tooltip" data-tip="Điểm bài viết">
              <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
              {{ valVote }}
            </div>
            <div class="tooltip" data-tip="Lượt bình luận">
              <OtherVIcon class-icon="text-primary" icon="fa-solid fa-comments" />
              {{ data.comment.length > 0 ? data.comment[0].count : "0" }}
            </div>
            <div class="tooltip" data-tip="Lượt xem">
              <OtherVIcon class-icon="text-info" icon="fa-solid fa-eye" />
              {{ data.view }}
            </div>
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
import { reportStore } from "~~/stores/report.store";

const props = defineProps({
  data: Object,
});

const useDialog = dialogStore();
const useAuth = authStore();
const usePost = postStore();
const useReport = reportStore();

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
        content: "Bạn chắc chắn muốn xóa bài viết?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        await usePost.deleteOne(props.data._id);
        await usePost.findByAuthor(props.data.author[0]._id);
      }
    );
  }
}

function openDialogPins() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn chắc chắn muốn ghim bài viết này bài viết?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        const data = {
          id: props.data._id,
          pins: true,
        };
        await usePost.update(data);
        await usePost.findByAuthor(props.data.author[0]._id);
      }
    );
  }
}

function openDialogDeletePins() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn chắc chắn muốn xóa ghim bài viết này bài viết?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        const data = {
          id: props.data._id,
          pins: false,
        };
        await usePost.update(data);
        await usePost.findByAuthor(props.data.author[0]._id);
      }
    );
  }
}

async function goReadPost() {
  if (useAuth.user && useAuth.user.id == props.data.author[0]._id) {
  } else {
    await usePost.update({
      id: props.data._id,
      view: props.data.view + 1,
    });
  }
  navigateTo(`/post/${props.data._id}`);
}

function openDialogReport() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialogInput(
      {
        title: "Thông báo cực căng!",
        content: "Bài viết này có vấn để?!",
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
  } else {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn cần đăng nhập để tạo bài viết",
        btn1: "Đăng nhập",
        btn2: "Hủy",
      },
      () => {
        useRouteS.redirectedFrom = useRoute().fullPath;
        return navigateTo("/auth/signin");
      }
    );
  }
}
</script>
