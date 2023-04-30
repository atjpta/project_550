<template>
  <div>
    <transition name="bounce">
      <div class="rounded-2xl mb-5">
        <div class="flex">
          <!-- ảnh team -->
          <div class="mx-auto min-w-max w-32 min-h-max h-32 mr-3">
            <img class="rounded-2xl w-32 h-32" :src="data?.image_cover_url" alt="" />
          </div>
          <div class="w-full">
            <div class="flex justify-between flex-col-reverse lg:flex-row">
              <div>
                <nuxtLink class="" :to="`/team/${data?._id}/read/post`">
                  <!-- tên team -->
                  <div class="text-2xl font-bold uppercase text-base-content hover:text-sky-500 duration-500">
                    {{ data?.name }}
                  </div>
                </nuxtLink>
              </div>

              <!-- phần tùy chọn cho chủ nhóm -->
              <div v-if="data?.role == 'chief'" class="flex justify-end">
                <div class="space-x-1 flex justify-end">
                  <nuxtLink :to="`/team/edit/${data?._id ?? data?.id}`" class="tooltip" data-tip="Sửa team">
                    <div class="btn btn-ghost text-primary">
                      <OtherVIcon icon="fa-solid fa-pen-to-square" />
                    </div>
                  </nuxtLink>

                  <div class="tooltip" data-tip="Xóa team">
                    <div @click="openDialogDelete()" class="btn btn-ghost text-error">
                      <OtherVIcon icon="fa-solid fa-trash-can" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- phần tùy chọn cho người đọc -->
              <div v-else class="dropdown dropdown-end flex justify-end">
                <div class="tooltip" data-tip="Lưu nhóm">
                  <div v-if="loading2 != 'save'" @click="openDialogSignin(save)" :class="classSave"
                    class="btn btn-ghost btn-square mr-1">
                    <OtherVIcon class-icon="text-xl" icon="fa-solid fa-bookmark" />
                  </div>
                  <div v-if="loading2 == 'save'" class="btn btn-circle btn-ghots loading mr-1"></div>
                </div>
                <div v-if="isRequest == 'join'" class="tooltip" data-tip="Xin vào nhóm">
                  <div @click="openDialogJoinTeam()" :class="[loading ? 'loading' : '']"
                    class="btn btn-ghost text-secondary mr-1">
                    Gia nhập
                  </div>
                </div>

                <div v-if="isRequest == 'loading'" class="tooltip" data-tip="Hủy xin vào">
                  <div @click="openDialogDeleteRequest()" :class="[loading ? 'loading' : '']"
                    class="btn btn-ghost text-warning mr-1">
                    Hủy gia nhập
                  </div>
                </div>

                <div v-if="isRequest == 'joined'" class="tooltip" data-tip="Thoát nhóm">
                  <div @click="openDialogOutTeam()" :class="[loading ? 'loading' : '']"
                    class="btn btn-ghost text-error mr-1">
                    Thoát
                  </div>
                </div>
              </div>
            </div>
            <!-- ảnh bìa và tiêu đề -->
            <div class="text-xl">{{ data?.introduce }}</div>
            <!-- tag -->
            <div class="mt-4 flex flex-wrap">
              <div v-for="i in data?.tag" :key="i._id" class="">
                <nuxt-link :to="`/tag/${i._id}/post`" class="btn btn-ghost bg-base-100/50 btn-sm mr-1 mt-1">{{ "#" +
                  i.name }}</nuxt-link>
              </div>
            </div>
          </div>
        </div>

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
        <div v-if="data?.status == 'private'">
          <div class="italic font-semibold mt-5">
            Nhóm riêng tư
            <div class="tooltip" data-tip="Cần tham gia nhóm mới có thể thấy được thêm thông tin">
              <div class="btn-xs btn btn-outline btn-info rounded-full text-xs scale-75">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
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
import { followStore } from "~~/stores/follow.store";
import { alertStore } from "~/stores/alert.store";

const props = defineProps({
  data: Object,
});

const useDialog = dialogStore();
const useAuth = authStore();
const useTeam = teamStore();
const useAlert = alertStore();
const route = useRoute();
const useRouteS = routeStore();
const loading = ref(false);
const loading2 = ref("");
const useFollow = followStore();
const useMember = memberStore();
const useRole = roleStore();
let idMember;

const slmember = computed(() => {
  let sl = 0;
  if (props.data?.member?.length) {
    props.data.member.forEach((e) => {
      if (e.is_member) {
        sl++;
      }
    });
  }
  return sl;
});

const classSave = computed(() => {
  if (useAuth.user) {
    if (useFollow.follow) {
      return "text-primary";
    }
  }
  return "";
});

const isRequest = computed(() => {
  let status = "join";
  useMember.isMember = false;
  if (props.data?.member?.length) {
    props.data.member.forEach((e) => {
      if (e.user == useAuth.user?.id && !e.is_member) {
        status = "loading";
        idMember = e._id;
      } else if (e.user == useAuth.user?.id && e.is_member) {
        status = "joined";
        idMember = e._id;
        useMember.isMember = true;
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
        content: "Bạn chắc chắn muốn xóa nhóm?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        try {
          await useMember.deleteAllByTeam(props.data._id || props.data.id);
          await useTeam.deleteOne(props.data?._id || props.data?.id);
          useAlert.setSuccess("Xóa nhóm thành công");
          return navigateTo("/team");
        } catch (error) {
          console.log(error);
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
        await useTeam.findOne(route.params.id);
        useAlert.setSuccess("Đã hủy đơn gia nhập");
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
        await useTeam.findOne(route.params.id);
        useAlert.setSuccess("Đã thoát nhóm thành công");
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
        user: useAuth.user.id,
        role: useRole.getIdMember,
        is_member: false,
      };
      await useMember.create(data);
      await useTeam.findOne(route.params.id);
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
        btn1: "Đăng nhập",
        btn2: "Hủy",
      },
      () => {
        useRouteS.redirectedFrom = route.fullPath;
        navigateTo("/auth/signin");
      }
    );
  }
}

function openDialogSignin(cb) {
  if (!useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn cần đăng nhập để dùng chức năng",
        btn1: "Đăng nhập",
        btn2: "Hủy",
      },
      () => {
        navigateTo("/auth/signin");
        useRouteS.redirectedFrom = `/series/${props.data._id}`;
      }
    );
  } else {
    cb();
  }
}

async function getFollow() {
  if (useAuth.user?.id) {
    await useFollow.findByFollow(route.params.id, useAuth.user.id);
  }
}

const save = async () => {
  try {
    loading2.value = "save";
    if (!useFollow.follow) {
      const data = {
        user: props.data._id,
        follow: useAuth.user.id,
      };
      await useFollow.create(data);
    } else {
      await useFollow.deleteOne(useFollow.follow.id);
    }
    await getFollow();
  } catch (error) {
    console.log(erorr);
    console.log("lỗi save");
  } finally {
    loading2.value = "";
  }
};

onMounted(() => {
  getFollow();
});
</script>
