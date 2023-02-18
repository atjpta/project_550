<template>
  <div class="h-52 bg-base-200 rounded-2xl border-l-4 border-primary p-5">
    <!-- hiển thị -->
    <div v-if="!openEdit">
      <div class="text-xl font-bold uppercase"># {{ data.name }}</div>
      <div class="indent-8 h-24 overflow-auto">
        {{ data.introduce }}
      </div>
      <div class="flex justify-around">
        <nuxtLink :to="`/tag/${data._id}/post`">
          <div class="text-center">
            <div class="btn btn-info btn-outline btn-sm">xem thêm</div>
          </div>
        </nuxtLink>
        <div class="space-x-1">
          <div @click="openEdit = true" class="btn btn-sm btn-primary btn-outline">
            <OtherVIcon icon="fa-solid fa-pen-to-square" />
          </div>
          <div @click="openDialogDelete()" class="btn btn-sm btn-error btn-outline">
            <OtherVIcon icon="fa-solid fa-trash-can" />
          </div>
        </div>
      </div>
    </div>

    <!-- edit -->
    <div v-else>
      <div class="text-xl font-bold uppercase flex">
        #
        <input
          v-model="nameT"
          type="text"
          class="input input-sm bg-inherit border-0 border-b-2 border-primary w-full"
        />
      </div>
      <div class="ml-3">
        <textarea
          v-model="introduceT"
          rows="3"
          placeholder="nhập lời giới thiệu"
          class="h-20 mt-4 textarea textarea-xs w-full bg-inherit border-0 border-b-2 border-primary"
        ></textarea>
      </div>
      <!-- <div class="indent-8 h-24 overflow-auto">{{ data.introduce }}</div> -->
      <div class="flex justify-around">
        <div
          @click="update()"
          :class="[loading ? 'loading' : '']"
          class="btn btn-sm btn-primary btn-outline"
        >
          <OtherVIcon icon="fa-solid fa-floppy-disk" />
        </div>
        <div @click="cancelEdit()" class="btn btn-sm btn-error btn-outline">
          <OtherVIcon icon="fa-solid fa-x" />
        </div>
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

const props = defineProps({
  data: Object,
});
const useTag = tagStore();
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
        content: "bạn chắc chắn muốn xóa tag này?",
        btn1: "ok",
        btn2: "hủy",
      },
      async () => {
        await useTag.deleteOne(props.data._id);
        await useTag.findByAuthor(useAuth.user.id);
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
