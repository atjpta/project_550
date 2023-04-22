<template>
  <div class="">
    <div v-if="useDialog.data.title" class="min-h-full w-screen bg-red-100/50 fixed z-50">
      <div class="card w-96 h-fit bg-base-200 shadow-xl mx-auto sticky top-1/4">
        <div class="card-body mt-5">
          <!-- <h2 class="card-title">{{ useDialog.data.title }} </h2> -->
          <h2 class="card-title">Thông báo</h2>
          <p>{{ useDialog.data.content }}</p>
          <div class="card-actions justify-around mx-5 mt-5">
            <!-- tùy chọn btn -->
            <div @click="triggerCb()" :class="[loading ? 'loading' : '']" class="btn btn-primary">
              {{ useDialog.data.btn1 }}
            </div>
            <div @click="useDialog.hiddenDialog()" class="btn text-error btn-ghost">
              {{ useDialog.data.btn2 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="useDialog.dataInput.title" class="min-h-full w-screen bg-red-100/50 fixed z-50">
      <div class="card w-96 h-fit bg-base-200 shadow-xl sticky top-1/4 mx-auto">
        <div class="card-body mt-5">
          <!-- <h2 class="card-title">{{ useDialog.dataInput.title }}</h2> -->
          <h2 class="card-title">Thông báo</h2>
          <p>{{ useDialog.dataInput.content }}</p>
          <textarea autofocus v-model="useDialog.dataInput.input" class="textarea textarea-primary w-full" type="text"
            placeholder="nhập..." />
          <div class="card-actions justify-around mx-5 mt-5">
            <!-- tùy chọn btn -->
            <div @click="triggerCbInput(useDialog.dataInput.input)" :class="[loading ? 'loading' : '']"
              class="btn btn-primary">
              {{ useDialog.dataInput.btn1 }}
            </div>
            <div @click="useDialog.hiddenDialog()" class="btn btn-ghost text-error">
              {{ useDialog.dataInput.btn2 }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dialogStore } from "~~/stores/dialog.store";

const loading = ref(false);
const useDialog = dialogStore();

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
</script>

<style></style>
