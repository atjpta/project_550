<template>
  <div class="hover:bg-gradient-to-l from-primary/10 via-primary/5 to-pink-500/5 rounded-md p-5">
    <!-- hiển thị -->
    <div v-if="!openEdit" class="flex justify-between">
      <div>
        <div class="text-xl font-bold uppercase"># {{ data.name }}</div>
        <div class="indent-8 overflow-hidden">
          {{ data.introduce || "Chưa có mô tả về tag này" }}
        </div>
      </div>
      <div class="flex justify-end">
        <nuxtLink :to="`/tag/${data._id}/post`" data-tip="Xem chi tiết"
          class="flex tooltip tooltip-left lg:tooltip-top btn btn-sm btn-ghost text-info">
          <OtherVIcon icon="fa-solid fa-eye" />
        </nuxtLink>
        <div @click="openEdit = true" class="btn btn-sm text-primary btn-ghost">
          <OtherVIcon icon="fa-solid fa-pen-to-square" />
        </div>
        <div @click="openDialogDelete()" class="btn btn-sm text-error btn-ghost">
          <OtherVIcon icon="fa-solid fa-trash-can" />
        </div>
      </div>
    </div>

    <!-- edit -->
    <div v-else>
      <div class="text-xl font-bold uppercase flex">
        #
        <input v-model="nameT" type="text" class="input input-sm bg-inherit border-primary w-full" />
      </div>
      <div class="ml-3">
        <textarea v-model="introduceT" rows="3" placeholder="Nhập lời giới thiệu..."
          class="h-20 mt-4 textarea textarea-xs w-full bg-inherit border-primary"></textarea>
      </div>
      <!-- <div class="indent-8 h-24 overflow-auto">{{ data.introduce }}</div> -->
      <div class="flex justify-end space-x-1">
        <div @click="update()" :class="[loading ? 'loading' : '']" class="btn btn-sm btn-primary">
          Lưu
        </div>
        <div @click="cancelEdit()" class="btn btn-sm text-error btn-ghost">Hủy</div>
      </div>
    </div>

    <div class="text-sm italic lowercase text-right opacity-75">
      {{ data.total_count }} lần sử dụng
    </div>
  </div>
</template>

<script setup>
import { authStore } from "~~/stores/auth.store";
import { tagStore } from "~~/stores/tag.store";
import { dialogStore } from "../../stores/dialog.store";
import { alertStore } from "~/stores/alert.store";

const props = defineProps({
  data: Object,
});
const useTag = tagStore();
const useAlert = alertStore();
const useAuth = authStore();
const useDialog = dialogStore();
const openEdit = ref(false);
const nameT = ref(props.data.name);
const introduceT = ref(props.data.introduce);
const loading = ref(false);
function openDialogDelete() {
  if (useAuth.isUserLoggedIn) {
    useDialog.showDialog(
      {
        title: "Thông báo cực căng!",
        content: "Bạn chắc chắn muốn xóa tag này?",
        btn1: "Ok",
        btn2: "Hủy",
      },
      async () => {
        try {
          await useTag.deleteOne(props.data._id);
          await useTag.findByAuthor(useAuth.user.id);
          useAlert.setSuccess("Xóa thành công ");
        } catch (error) {
          console.log(error);
        }
      }
    );
  }
}

function cancelEdit() {
  openEdit.value = false;
  nameT.value = props.data.name;
  introduceT.value = props.data.introduce;
}

async function update() {
  const data = {
    id: props.data._id,
    name: nameT.value,
    introduce: introduceT.value,
  };
  try {
    loading.value = true;
    await useTag.update(data);
    await useTag.findByAuthor(useAuth.user.id);
    cancelEdit();
  } catch (error) {
    console.log(error);
    console.log("lỗi update tag");
  } finally {
    loading.value = false;
  }
}
</script>

<style></style>
