<template>
  <div
    :class="
      preview
        ? 'bg-base-100'
        : 'bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5'
    "
    class="p-5 rounded-2xl"
  >
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center">Chỉnh sửa bài viết</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-2xl mt-5">
            Tiêu đề
            <div class="tooltip" data-tip="Không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <input
            v-model="usePost.post_edit.title"
            placeholder="Nhập tiêu đề..."
            type="text"
            class="input input-primary w-full"
          />
        </div>

        <!-- ảnh bìa -->
        <div class="text-2xl mt-5">
          Ảnh bìa
          <div>
            <ImageVUploadsimple :data="usePost.post_edit.image_cover_url" />
          </div>
        </div>
        <!-- phần tag của bài viết -->
        <div>
          <div class="text-2xl mt-5">
            Thẻ tag
            <div class="tooltip" data-tip="Được chọn tối đa 5 tag">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <TagVInputTag :data="usePost.post_edit.tag" />
        </div>

        <!-- phần nội dung bài viết -->
        <div class="flex justify-between mt-5 mb-2">
          <div class="text-2xl">
            Nội dung
            <div class="tooltip" data-tip="Không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
        </div>

        <div class="min-h-[30vh]">
          <QuillEditor
            class="min-h-[30vh]"
            :modules="modules"
            placeholder="Nhập nội dung..."
            ref="quill"
            theme="snow"
            toolbar="full"
          />
        </div>
      </div>
    </transition>
    <!-- preview -->
    <transition name="bounce">
      <div v-show="preview == true">
        <PostVPreviewpost :data="usePost.post_edit" />
      </div>
    </transition>
    <!-- các nút btn -->
    <div class="flex justify-end space-x-5 my-5">
      <div
        v-if="preview == false"
        @click="showPreview()"
        class="btn btn-outline btn-sm btn-info"
      >
        Xem trước
      </div>
      <div
        v-if="preview == true"
        @click="preview = false"
        class="btn btn-outline btn-sm btn-info"
      >
        Chỉnh tiếp
      </div>
      <div
        @click="save()"
        :class="[loading ? 'loading' : '']"
        class="btn btn-sm btn-primary"
      >
        Lưu
      </div>
      <div @click="useRouter().back()" class="btn btn-ghost btn-sm text-error">Hủy</div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import { userStore } from "~~/stores/user.store";
import { authStore } from "~~/stores/auth.store";
import { imageStore } from "~~/stores/image.store";
import { postStore } from "~~/stores/post.store";
import ImageUploader from "quill-image-uploader";
import config from "~~/config";
import axios from "axios";
import { courseStore } from "~/stores/course.store";
import { statusStore } from "~/stores/status.store";
const url = config.url.apiimage;
const supabase = useSupabaseClient();
const modules = {
  name: "imageUploader",
  module: ImageUploader,
  options: {
    upload: (file) => {
      return new Promise(async (resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);
        let { error: uploadError } = await supabase.storage
          .from("blog-files/image")
          .upload(file.name, file);
        if (uploadError.statusCode != 409) {
          useAlert.setError(" lỗi upload ảnh ");
          reject("Upload failed");
          console.error("Error:", err);
          throw uploadError;
        }
        resolve(url + file.name);
      });
    },
  },
};
const props = defineProps({
  loading: Boolean,
});
const quill = ref();
const preview = ref(false);

const useUser = userStore();
const useCourse = courseStore();
const useAuth = authStore();
const useImage = imageStore();
const usePost = postStore();
const route = useRoute();
const useStatus = statusStore();
const emit = defineEmits(["save"]);

function getdata() {
  useStatus.List_status.forEach((e) => {
    if (e.name == "puclic") {
      usePost.post_edit.status = e.id;
    }
  });
  usePost.post_edit.author = useUser.user;
  usePost.post_edit.course = useCourse.course;
  usePost.post_edit.content = quill.value.getContents();
}

function save() {
  getdata();
  emit("save");
}

function showPreview() {
  getdata();
  preview.value = true;
}

const setContent = () => {
  quill.value.setContents(usePost.post_edit.content);
};

async function getApi() {
  await useStatus.findAll();
  await useCourse.findOne(route.params.id);
}

onMounted(() => {
  getApi();
});

onUnmounted(() => {});
</script>

<style></style>
