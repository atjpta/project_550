<template>
  <div class="p-5 bg-base-200 rounded-2xl">
    <div class="text-4xl text-center font-semibold">Chỉnh sửa bài viết</div>

    <!-- tiêu đề -->
    <div>
      <div class="text-xl font-semibold mt-5">Tiêu đề</div>
      <input
        placeholder="nhập tiêu đề"
        type="text"
        class="p-1 bg-inherit border-0 border-b-2 border-primary w-full"
      />
    </div>

    <!-- ảnh bìa -->
    <div class="text-xl font-semibold mt-5">
      Ảnh bìa cho bài viết
      <div>
        <ImageVUploadsimple :data="data.image_cover_url" />
      </div>
    </div>
    <!-- phần tag của bài viết -->
    <div>
      <div class="text-xl font-semibold mt-5">
        Chọn tag
        <div class="tooltip" data-tip="được chọn tối đa 5 tag">
          <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
            <OtherVIcon class-icon="" icon="fa-solid fa-info" />
          </div>
        </div>
      </div>
      <TagVTag />
    </div>

    <!-- phần chọn serise -->
    <div>
      <div class="text-xl font-semibold mt-5 mb-2">
        Chọn chuỗi bài viết của bạn
        <div class="tooltip" data-tip="bài viết sẽ thuộc vào chuỗi bài viết mà bạn chọn">
          <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
            <OtherVIcon class-icon="" icon="fa-solid fa-info" />
          </div>
        </div>
      </div>
      <select class="select-sm select select-primary w-full max-w-xs">
        <option disabled selected>Không chọn</option>
        <option v-for="i in 5" :key="i">{{ "series " + i }}</option>
      </select>
    </div>
    <div class="btn btn-ghost btn-xs italic lowercase">tạo 1 chuỗi bài viết mới?</div>

    <!-- phần chọn team -->
    <div>
      <div class="text-xl font-semibold mt-5 mb-2">
        Chọn team muốn đăng
        <div class="tooltip" data-tip="bài viết sẽ thuộc vào team mà bạn chọn">
          <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
            <OtherVIcon class-icon="" icon="fa-solid fa-info" />
          </div>
        </div>
      </div>
      <select class="select-sm select select-primary w-full max-w-xs">
        <option disabled selected>Chung</option>
        <option v-for="i in 5" :key="i">{{ "team " + i }}</option>
      </select>
    </div>

    <!-- phần nội dung bài viết -->
    <div class="flex justify-between mt-5 mb-2">
      <div class="text-xl font-semibold">Nội dung</div>
    </div>
    <div class="-z-10">
      <QuillEditor ref="quill" theme="snow" toolbar="full" />
    </div>
    <!-- các nút btn -->
    <div class="flex justify-end space-x-5 m-5">
      <div class="btn btn-outline btn-sm btn-info">xem trước</div>
      <div class="btn btn-outline btn-sm btn-primary">lưu</div>
      <div class="btn btn-outline btn-sm btn-error">hủy</div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
const quill = ref();

const props = defineProps({
  data: Object,
});
</script>

<style></style>
