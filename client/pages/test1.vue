<template>
  <div>
    <QuillEditor ref="quill" :modules="modules" toolbar="full" />
    <div class="btn" @click="test()">get data</div>
  </div>
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import ImageUploader from "quill-image-uploader";
import config from "~~/config";
import axios from "axios";
const quill = ref();
const url = config.url.apiimage + "/image";
const modules = {
  name: "imageUploader",
  module: ImageUploader,
  options: {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);

        axios
          .post(url, formData)
          .then((res) => {
            resolve(url + "/" + res.data.filename);
          })
          .catch((err) => {
            reject("Upload failed");
            console.error("Error:", err);
          });
      });
    },
  },
};

function test() {
  console.log(quill.value.getContents());
}
</script>

<style></style>
