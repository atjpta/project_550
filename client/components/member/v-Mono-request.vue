<template>
  <div tabindex="2" class="bg-base-100 rounded-2xl shadow-md glass mb-3 p-5">
    <div class="flex justify-between items-center text-left">
      <!-- tên -->
      <div class="basis-1/2">
        <nuxt-link
          :to="`/user/${data.user._id}/overview`"
          class="flex items-center space-x-3 hover:text-info"
        >
          <div class="avatar">
            <div class="mask mask-squircle w-12 h-12">
              <img :src="data.user.avatar_url" />
            </div>
          </div>
          <div>
            <div class="font-bold">{{ data.user.name }}</div>
          </div>
        </nuxt-link>
      </div>
      <!-- các btn -->
      <div class="flex space-x-1">
        <div
          @click="openDialogJoin()"
          class="btn btn-primary btn-sm btn-outline tooltip flex"
          data-tip="Cho vào nhóm"
        >
          <OtherVIcon icon="fa-solid fa-check" />
        </div>
        <div
          @click="openDialogDelete()"
          :class="[loading ? 'loading' : '']"
          data-tip="Hủy yêu cần"
          class="btn btn-sm btn-error btn-outline tooltip flex"
        >
          <OtherVIcon icon="fa-solid fa-x" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { memberStore } from "~~/stores/member.store";
import { notificationStore } from "~~/stores/notification.store";
import { roleStore } from "~~/stores/role.store";
import { teamStore } from "~~/stores/team.store";
import { dialogStore } from "../../stores/dialog.store";
const useRole = roleStore();
const useTeam = teamStore();
const useMember = memberStore();
const useDialog = dialogStore();
const loading = ref(false);
const route = useRoute();
const useNotification = notificationStore();
const props = defineProps({
  data: Object,
});

async function update() {
  const data = {
    id: props.data.id,
    is_member: true,
  };

  const dataNotifi = {
    to: props.data.user._id,
    content: `Bạn đã tham gia vào nhóm "${useTeam.team[0].name}"`,
    url: route.fullPath,
    type: "info",
  };
  try {
    loading.value = true;
    await useMember.update(data);
    await useMember.findByRequestTeam(useTeam.team[0]._id);
    await useNotification.createOne(dataNotifi);
  } catch (error) {
    console.log(error);
    console.log("lỗi update ");
  } finally {
    loading.value = false;
  }
}

function openDialogDelete() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "Bạn chắc chắn muốn hủy bỏ yêu cầu của người dùng này?",
      btn1: "Ok",
      btn2: "Hủy",
    },
    async () => {
      try {
        loading.value = true;
        await useMember.deleteOne(props.data.id);
        await useMember.findByRequestTeam(useTeam.team[0]._id);
      } catch (error) {
        console.log(error);
        console.log("lỗi xóa ");
      } finally {
        loading.value = false;
      }
    }
  );
}

function openDialogJoin() {
  useDialog.showDialog(
    {
      title: "Thông báo cực căng!",
      content: "Bạn chắc chắn muốn cho người dùng này thành thành viên của nhóm nhóm?",
      btn1: "Ok",
      btn2: "Hủy",
    },
    async () => {
      update();
    }
  );
}
</script>

<style></style>
