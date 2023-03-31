<template>
  <div>
    <transition name="bounce">
      <div
        class="hover:bg-gradient-to-l bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-5">
        <div class="flex">
          <!-- ảnh team -->
          <div class="mx-auto min-w-max w-32 min-h-max h-32 mr-3">
            <img class="rounded-2xl w-32 h-32" :src="data.teams[0].image_cover_url" alt="" />
          </div>
          <div class="w-full">
            <div class="flex justify-between flex-col-reverse lg:flex-row">
              <div>
                <nuxtLink class="" :to="`/team/${data.teams[0]._id}/list-post`">
                  <!-- tên team -->
                  <div class="text-2xl font-bold uppercase text-base-content hover:text-sky-500 duration-500">
                    {{ data.teams[0].name }}
                  </div>
                </nuxtLink>
              </div>

              <!-- phần tùy chọn cho chủ nhóm -->
              <div v-if="data.role == 'chief'" class="flex justify-end">
                <div class="space-x-1 flex justify-end">
                  <nuxtLink :to="`/team/edit/${data._id ?? data.id}`" class="tooltip" data-tip="sửa team">
                    <div class="btn btn-ghost text-primary">
                      <OtherVIcon icon="fa-solid fa-pen-to-square" />
                    </div>
                  </nuxtLink>

                  <div class="tooltip" data-tip="xóa team">
                    <div :class="[loading ? 'loading' : '']" @click="openDialogDelete()" class="btn btn-ghost text-error">
                      <OtherVIcon icon="fa-solid fa-trash-can" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- phần tùy chọn cho người đọc -->
              <div v-else class="dropdown dropdown-end flex justify-end">
                <div v-if="isRequest == 'join'" class="tooltip" data-tip="xin vào nhóm">
                  <div @click="openDialogJoinTeam()" :class="[loading ? 'loading' : '']"
                    class="btn btn-ghost text-secondary mr-1">
                    gia nhập
                  </div>
                </div>

                <div v-if="isRequest == 'loading'" class="tooltip" data-tip="hủy xin vào">
                  <div @click="openDialogDeleteRequest()" :class="[loading ? 'loading' : '']"
                    class="btn btn-ghost text-warning mr-1">
                    hủy gia nhập
                  </div>
                </div>

                <div v-if="isRequest == 'joined'" class="tooltip" data-tip="thoát nhóm">
                  <div @click="openDialogOutTeam()" :class="[loading ? 'loading' : '']"
                    class="btn btn-ghost text-error mr-1">
                    thoát
                  </div>
                </div>

                <label tabindex="0" class="btn btn-ghost">
                  <OtherVIcon icon="fa-solid fa-ellipsis-vertical" />
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
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
                        bỏ theo dõi nhóm
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <!-- ảnh bìa và tiêu đề -->
            <div class="text-xl">{{ data.teams[0].introduce }}</div>
            <!-- tag -->
            <div class="mt-4 flex">
              <div v-for="i in data.tag" :key="i._id" class="">
                <nuxt-link :to="`/tag/${i._id}/post`" class="btn btn-outline text-sm mr-1 mt-1">{{ "#" + i.name
                }}</nuxt-link>
              </div>
            </div>
          </div>
        </div>

        <!-- các trạng thái của team  -->
        <div class="flex space-x-5 mt-2">
          <div class="tooltip" data-tip="điểm nhóm">
            <OtherVIcon class-icon="text-warning" icon="fa-solid fa-star" />
            {{ valVote }}
          </div>
          <div class="tooltip" data-tip="số lượng thành viên">
            <OtherVIcon class-icon="text-info" icon="fa-solid fa-users-line" />
            {{ slmember }}
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
import { followStore } from "~~/stores/follow.store";

const props = defineProps({
  data: Object,
});
const useFollow = followStore();
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
  props.data.vote_post?.forEach((e) => {
    val += e.val;
  });
  props.data.vote_question?.forEach((e) => {
    val += e.val;
  });
  return val;
});

async function openDialogDelete() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "bạn chắc chắn muốn xóa bài viết?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        try {
          loading.value = true;
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
      content: "bạn chắc chắn muốn hủy bỏ yêu cầu?",
      btn1: "ok",
      btn2: "hủy",
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
      content: "bạn chắc chắn muốn thoát khỏi nhóm?",
      btn1: "ok",
      btn2: "hủy",
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
        content: "bạn cần đăng nhập để sử dụng chức năng",
        btn1: "ok",
        btn2: "hủy",
      },
      () => {
        useRouteS.redirectedFrom = route.fullPath;
        navigateTo("/auth/signin");
      }
    );
  }
}

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
