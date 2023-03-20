<template>
  <div>
    <div
      v-if="useDialog.data.title"
      class="min-h-screen w-screen bg-red-100/50 fixed z-50"
    >
      <div class="card w-96 h-fit bg-base-200 shadow-xl mt-40 mx-auto">
        <div class="card-body mt-5">
          <h2 class="card-title">{{ useDialog.data.title }}</h2>
          <p>{{ useDialog.data.content }}</p>
          <div class="card-actions justify-around mx-5 mt-5">
            <!-- tùy chọn btn -->
            <div
              @click="triggerCb()"
              :class="[loading ? 'loading' : '']"
              class="btn btn-primary"
            >
              {{ useDialog.data.btn1 }}
            </div>
            <div @click="useDialog.hiddenDialog()" class="btn text-error btn-ghost">
              {{ useDialog.data.btn2 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="useDialog.dataInput.title"
      class="min-h-screen w-screen bg-red-100/50 fixed z-50 inset-0"
    >
      <div class="card w-96 h-fit bg-base-200 shadow-xl mt-40 mx-auto">
        <div class="card-body mt-5">
          <h2 class="card-title">{{ useDialog.dataInput.title }}</h2>
          <p>{{ useDialog.dataInput.content }}</p>
          <input
            autofocus
            v-model="inputData"
            class="bg-white/5 border-0 border-b-2 mb-5 w-full"
            type="text"
          />
          <div class="card-actions justify-around mx-5 mt-5">
            <!-- tùy chọn btn -->
            <div
              @click="triggerCbInput(inputData)"
              :class="[loading ? 'loading' : '']"
              class="btn btn-primary btn-outline"
            >
              {{ useDialog.dataInput.btn1 }}
            </div>
            <div @click="useDialog.hiddenDialog()" class="btn btn-error btn-outline">
              {{ useDialog.dataInput.btn2 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dialogStore } from "../../stores/dialog.store";
import { ref, watch } from "vue";

const loading = ref(false);
const useDialog = dialogStore();
const inputData = ref("");

async function triggerCb() {
  loading.value = true;
  try {
    await useDialog.cb();
  } catch (error) {
    console.log(error);
    console.log("có lỗi khi triggerCb");
  } finally {
    loading.value = false;
    useDialog.hiddenDialog();
  }
}

async function triggerCbInput(input) {
  loading.value = true;
  try {
    await useDialog.cb(input);
  } catch (error) {
    console.log(rerror);
    console.log("có lỗi khi triggerCb");
  } finally {
    loading.value = false;
    useDialog.hiddenDialog();
  }
}

watch(
  () => useDialog.dataInput,
  (bf) => {
    if (!bf.title) {
      inputData.value = "";
    }
  }
);
</script>

<style></style>
