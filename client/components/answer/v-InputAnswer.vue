<template>
  <div class="">
    <div class="hidden">
      {{ data.content }}
    </div>
    <div>
      <QuillEditor
        placeholder="Nhập câu trả lời..."
        @text-change="getdata()"
        ref="quill"
        theme="snow"
        toolbar="full"
      />
    </div>

    <div
      @click="$emit('send')"
      :class="[loading ? 'loading' : '']"
      class="btn btn-primary btn-sm btn-outline my-2"
    >
      <OtherVIcon icon="fa-solid fa-paper-plane mr-1" />
      Gửi
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUpdated, ref } from "vue";
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

const quill = ref();

const props = defineProps({
  data: Object,
  reset: Intl,
  loading: Boolean,
});

function getdata() {
  props.data.content = quill.value.getContents();
}

onMounted(() => {
  if (props.data.content) {
    quill.value.setContents(props.data.content);
  }
});
</script>

<style></style>
