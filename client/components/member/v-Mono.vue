<template>
  <div class="bg-base-100 rounded-2xl shadow-md glass mb-3 p-5">
    <div class="flex items-center text-left">
      <!-- tên -->
      <div class="basis-1/2">
        <nuxt-link :to="`/user/${data.user._id}/overview`" class="flex items-center space-x-3 hover:text-info">
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
      <!-- chức vụ -->
      <div class="basis-1/2">
        {{ data.role?.name }}
      </div>
      <!-- các btn -->
      <div v-if="isEdit" class="flex space-x-1">
        <div @click="openEdit = !openEdit" class="btn btn-primary btn-sm btn-outline tooltip flex"
          data-tip="Chỉnh chức vụ">
          <OtherVIcon icon="fa-solid fa-pen-to-square" />
        </div>
        <div @click="openDialogDelete()" :class="[loading ? 'loading' : '']" data-tip="Xóa khỏi nhóm"
          class="btn btn-sm btn-error btn-outline tooltip flex">
          <OtherVIcon icon="fa-solid fa-x" />
        </div>
      </div>
      <div v-else class="mr-20"></div>
    </div>
    <!-- tùy chon edit -->
    <div v-if="openEdit" class="items-center lg:flex justify-center space-y-1">
      <div class="lg:flex space-y-1 lg:space-y-0">
        <div class="">
          <select v-model="selectRole" class="select-sm select select-primary w-full max-w-xs lg:w-fit">
            <option :value="i" v-for="i in useRole.List_role_team" :key="i.id">
              {{ i.name }}
            </option>
          </select>
        </div>
        <div @click="update" :class="[loading ? 'loading' : '']"
          class="btn btn-sm btn-primary btn-outline lg:ml-1 lg:w-fit w-full">
          <OtherVIcon icon="fa-solid fa-floppy-disk" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { memberStore } from "~~/stores/member.store";
import { roleStore } from "~~/stores/role.store";
import { teamStore } from "~~/stores/team.store";
import { dialogStore } from "../../stores/dialog.store";
const useRole = roleStore();
const useTeam = teamStore();
const useMember = memberStore();
const useDialog = dialogStore();
const loading = ref(false);
const openEdit = ref(false);
const props = defineProps({
  data: Object,
});

const isEdit = computed(() => {
  if (props.data.role?.name == "trường nhóm") {
    return false;
  } else if (
    props.data.role?.name == "người điều hành" &&
    useTeam.team[0]?.role == "chief"
  ) {
    return true;
  } else if (
    props.data.role?.name == "người điều hành" &&
    useTeam.team[0]?.role == "handler"
  ) {
    return false;
  } else if (
    (props.data.role?.name == "thành viên" && useTeam.team[0]?.role == "chief") ||
    useTeam.team[0]?.role == "handler"
  ) {
    return true;
  }
});

const selectRole = ref(props.data.role);

async function update() {
  const data = {
    id: props.data.id,
    role: selectRole.value._id,
  };
  try {
    loading.value = true;
    await useMember.update(data);
    await useMember.findByTeam(useTeam.team[0]._id);
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
      content: "Bạn chắc chắn muốn xóa thành viên này ra khỏi nhóm?",
      btn1: "Ok",
      btn2: "Hủy",
    },
    async () => {
      try {
        loading.value = true;
        await useMember.deleteOne(props.data.id);
        await useMember.findByTeam(useTeam.team[0]._id);
      } catch (error) {
        console.log(error);
        console.log("lỗi xóa ");
      } finally {
        loading.value = false;
      }
    }
  );
}
</script>

<style></style>
