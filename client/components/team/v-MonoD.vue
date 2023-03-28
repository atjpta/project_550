<template>
  <div>
    <nuxtLink class="" :to="`/team/${data.team._id}/list-post`">
      <transition name="bounce">
        <div
          class="rounded-2xl p-5 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"
        >
          <div class="flex">
            <!-- ảnh team -->
            <div class="mx-auto min-w-max w-32 min-h-max h-32 mr-3">
              <img
                class="rounded-2xl w-32 h-32"
                :src="data.team.image_cover_url"
                alt=""
              />
            </div>
            <div class="w-full">
              <div class="flex justify-between flex-col-reverse lg:flex-row">
                <div>
                  <!-- tên team -->
                  <div
                    class="text-2xl font-bold uppercase text-base-content hover:text-sky-500 duration-500"
                  >
                    {{ data.team.name }}
                  </div>
                </div>
              </div>
              <!-- ảnh bìa và tiêu đề -->
              <div class="text-xl">{{ data.team.introduce }}</div>
              <!-- tag -->
              <div class="mt-4 flex">
                <div v-for="i in data.tag" :key="i._id" class="">
                  <nuxt-link
                    :to="`/tag/${i._id}/post`"
                    class="btn btn-outline btn-sm mr-1 mt-1"
                    >{{ "#" + i.name }}</nuxt-link
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </nuxtLink>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { dialogStore } from "~~/stores/dialog.store";
import { teamStore } from "~~/stores/team.store";
import { routeStore } from "~~/stores/route.store";
import { memberStore } from "~~/stores/member.store";
import { roleStore } from "~~/stores/role.store";

const props = defineProps({
  data: Object,
});

const useDialog = dialogStore();
const useAuth = authStore();
const useTeam = teamStore();
const route = useRoute();
const useRouteT = routeStore();
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
        content: "bạn chắc chắn muốn xóa Nhóm?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        try {
          loading.value = true;
          await useTeam.deleteOne(props.data._id || props.data.id);
          await useTeam.findAll();
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
        await useTeam.findAll();
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
        await useTeam.findAll();
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
      await useTeam.findAll();
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
        useRouteT.redirectedFrom = route.fullPath;
        navigateTo("/auth/signin");
      }
    );
  }
}
</script>
