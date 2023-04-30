<template>
  <div>
    <transition name="bounce">
      <div
        class="indicator w-full hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-md p-5">
        <div class="flex">
          <div>
            <!-- ảnh team -->
            <nuxtLink class="" :to="`/team/${data._id}/read/post`">
              <div class="rounded-2xl mx-auto min-w-max w-32 min-h-max h-32 mr-3 overflow-hidden">
                <img class="cursor-pointer duration-500 rounded-2xl w-32 h-32 hover:scale-110" :src="data.image_cover_url"
                  alt="" />
              </div>
            </nuxtLink>

            <!-- các trạng thái của team  -->
            <div class="flex space-x-5 mt-2">
              <div class="tooltip" data-tip="Điểm nhóm">
                <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
                {{ valVote }}
              </div>
              <div class="tooltip" data-tip="Số lượng thành viên">
                <OtherVIcon class-icon="text-info" icon="fa-solid fa-users-line" />
                {{ slmember }}
              </div>
            </div>
          </div>

          <div class="ml-5">
            <div class="flex justify-between flex-col-reverse lg:flex-row">
              <div>
                <nuxtLink class="" :to="`/team/${data._id}/read/post`">
                  <!-- tên team -->
                  <div class="text-2xl font-bold uppercase text-base-content hover:text-sky-500 duration-500">
                    {{ data.name }}
                  </div>
                </nuxtLink>
              </div>

              <!-- phần tùy chọn cho người đọc -->
              <div class="dropdown dropdown-end indicator-item mt-10 mr-10">
                <label tabindex="0" class="btn btn-ghost">
                  <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <div v-if="data.role != 'chief'">
                    <li @click="openDialogReport()" class="hover-bordered">
                      <a>
                        <div>
                          <OtherVIcon icon="fa-solid fa-flag" />
                          Báo cáo
                        </div>
                      </a>
                    </li>
                  </div>
                  <!-- tùy chọn cho trường nhóm -->
                  <div v-if="data.role == 'chief'">
                    <li @click="navigateTo(`/team/edit/${data._id ?? data.id}`)" class="hover-bordered">
                      <a>
                        <div>
                          <OtherVIcon class-icon="text-primary" icon="fa-solid fa-pen-to-square" />
                          Sửa
                        </div>
                      </a>
                    </li>
                    <li @click="openDialogDelete()" class="hover-bordered">
                      <a>
                        <div>
                          <OtherVIcon class-icon="text-error" icon="fa-solid fa-trash" />
                          Xóa
                        </div>
                      </a>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            <!-- ảnh bìa và tiêu đề -->
            <div class="text-xl">{{ data.introduce }}</div>
            <!-- tag -->
            <div class="mt-4 flex flex-wrap">
              <div v-for="i in data.tag" :key="i._id" class="">
                <nuxt-link :to="`/tag/${i._id}/post`" class="btn btn-ghost bg-base-100/50 btn-sm mr-1 mt-1">{{ "#" +
                  i.name }}</nuxt-link>
              </div>
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
import { teamStore } from "~~/stores/team.store";
import { routeStore } from "~~/stores/route.store";
import { memberStore } from "~~/stores/member.store";
import { roleStore } from "~~/stores/role.store";
import { reportStore } from "~~/stores/report.store";

const props = defineProps({
  data: Object,
});
const useReport = reportStore();
const useDialog = dialogStore();
const useAuth = authStore();
const useTeam = teamStore();
const route = useRoute();
const useRouteS = routeStore();
const useMember = memberStore();
const useRole = roleStore();
const loading = ref(false);
let idMember;
const slmember = computed(() => {
  let sl = 0;
  if (props.data.member?.length) {
    props.data.member.forEach((e) => {
      if (e.is_member) {
        sl++;
      }
    });
  }
  return sl;
});

const isRequest = computed(() => {
  let status = "join";
  if (props.data?.member?.length) {
    props.data.member.forEach((e) => {
      if (e.user == useAuth.user?.id && !e.is_member) {
        status = "loading";
        idMember = e._id;
      } else if (e.user == useAuth.user?.id && e.is_member) {
        status = "joined";
        idMember = e._id;
      }
    });
  }
  return status;
});
const valVote = computed(() => {
  let val = 0;
  props.data?.vote_post?.forEach((e) => {
    if (e._id) {
      val += e.val;
    }
  });
  props.data?.vote_question?.forEach((e) => {
    if (e._id) {
      val += e.val;
    }
  });
  return val;
});
async function openDialogDelete() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn chắc chắn muốn xóa Nhóm?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        try {
          loading.value = true;
          await useMember.deleteAllByTeam(props.data._id || props.data.id);
          await useTeam.deleteOne(props.data._id || props.data.id);
          useRouteS.refreshData();
        } catch (error) {
          console.log(error);
          console.log("lỗi xóa ");
        } finally {
          loading.value = false;
        }
      }
    );
  }
}

function openDialogDeleteRequest() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "Bạn chắc chắn muốn hủy bỏ yêu cầu?",
      btn1: "Ok",
      btn2: "Hủy",
    },
    async () => {
      try {
        loading.value = true;
        await useMember.deleteOne(idMember);
        useRouteS.refreshData();
      } catch (error) {
        console.log(error);
        console.log("lỗi xóa ");
      } finally {
        loading.value = false;
      }
    }
  );
}

function openDialogOutTeam() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "Bạn chắc chắn muốn thoát khỏi nhóm?",
      btn1: "Ok",
      btn2: "Hủy",
    },
    async () => {
      try {
        loading.value = true;
        await useMember.deleteOne(idMember);
        useRouteS.refreshData();
      } catch (error) {
        console.log(error);
        console.log("lỗi xóa ");
      } finally {
        loading.value = false;
      }
    }
  );
}

async function openDialogJoinTeam() {
  if (useAuth.isUserLoggedIn) {
    try {
      loading.value = true;

      const data = {
        team: props.data._id || props.data.id,
        user: useAuth.user?.id,
        role: useRole.getIdMember,
        is_member: false,
      };
      await useMember.create(data);
      useRouteS.refreshData();
    } catch (error) {
      console.log(error);
      console.log("lỗi tạo request member");
    } finally {
      loading.value = false;
    }
  } else {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn cần đăng nhập để sử dụng chức năng",
        btn1: "Ok",
        btn2: "Hủy",
      },
      () => {
        useRouteS.redirectedFrom = route.fullPath;
        navigateTo("/auth/signin");
      }
    );
  }
}

function openDialogReport() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialogInput(
      {
        title: "Thông báo cực căng!",
        content: "Nhóm này có vấn để?!",
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
