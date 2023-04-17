<template>
  <div :class="
    preview
      ? 'bg-base-100'
      : 'bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5'
  " class="p-5 rounded-2xl">
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-extrabold">Chỉnh sửa bài viết</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-extrabold mt-5">
            Tiêu đề
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <input v-model="usePost.post_edit.title" placeholder="nhập tiêu đề" type="text"
            class="input input-primary w-full" />
        </div>

        <!-- ảnh bìa -->
        <div class="text-xl font-extrabold mt-5">
          Ảnh bìa cho bài viết
          <div>
            <ImageVUploadsimple :data="usePost.post_edit.image_cover_url" />
          </div>
        </div>
        <!-- phần tag của bài viết -->
        <div>
          <div class="text-xl font-extrabold mt-5">
            Chọn tag
            <div class="tooltip" data-tip="được chọn tối đa 5 tag">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <TagVInputTag :data="usePost.post_edit.tag" />
        </div>
        <!-- phần chọn serise -->
        <div>
          <div class="text-xl font-extrabold mt-5 mb-2">
            Chọn chuỗi bài viết
            <div class="tooltip" data-tip="cần có chuỗi bài viết trước">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <select v-model="usePost.post_edit.series" class="select-sm select select-primary w-full max-w-xs">
            <option :value="{}">Không có</option>
            <option :value="i" v-for="i in list_series" :key="i">
              {{ i.name }}
            </option>
          </select>
        </div>
        <nuxt-link :to="`/series/team/${route.params.id}`">
          <div class="btn btn-ghost btn-xs italic lowercase">tạo chuỗi bài viết mới?</div>
        </nuxt-link>

        <!-- chọn trạng thái -->
        <div>
          <div class="text-xl font-extrabold mt-5 mb-2">
            Chọn trạng thái bài viết
            <div class="tooltip" data-tip="riêng tư là chỉ bạn có thể thấy">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <select v-model="selectStatus" class="select-sm select select-primary w-full max-w-xs">
            <option :value="i" v-for="i in list_status" :key="i">
              {{ i.name == "public" ? "Công khai" : "Riêng tư" }}
            </option>
          </select>
        </div>

        <!-- phần nội dung bài viết -->
        <div class="flex justify-between mt-5 mb-2">
          <div class="text-xl font-extrabold">
            Nội dung
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
        </div>

        <div class="-z-10">
          <QuillEditor :modules="modules" placeholder="nhập nội dung" ref="quill" theme="snow" toolbar="full" />
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
      <div v-if="preview == false" @click="showPreview()" class="btn btn-outline btn-sm btn-info">
        xem trước
      </div>
      <div v-if="preview == true" @click="preview = false" class="btn btn-outline btn-sm btn-info">
        chỉnh tiếp
      </div>
      <div @click="save()" :class="[loading ? 'loading' : '']" class="btn btn-sm btn-primary">
        lưu
      </div>
      <div @click="useRouter().back()" class="btn btn-ghost btn-sm text-error">hủy</div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import { userStore } from "~~/stores/user.store";
import { teamStore } from "~~/stores/team.store";
import { seriesStore } from "~~/stores/series.store";
import { authStore } from "~~/stores/auth.store";
import { imageStore } from "~~/stores/image.store";
import { statusStore } from "~~/stores/status.store";
import { postStore } from "~~/stores/post.store";
import ImageUploader from "quill-image-uploader";
import config from "~~/config";
import axios from "axios";
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
const useAuth = authStore();
const useStatus = statusStore();
const useImage = imageStore();
const useTeam = teamStore();
const useSeries = seriesStore();
const usePost = postStore();
const route = useRoute();
const selectStatus = ref();
const list_status = computed(() => {
  useStatus.getPost.forEach((e) => {
    if (selectStatus.value) {
      if (selectStatus.value[0]?.name == e.name) {
        selectStatus.value = e;
        return;
      }
    } else if (e.name == "public") {
      selectStatus.value = e;
    }
  });
  return useStatus.getPost;
});

const list_series = computed(() => {
  if (!usePost.post_edit.series) {
    usePost.post_edit.series = {};
  }
  let list = [];
  useSeries.List_series.forEach((e) => {
    if (e.id == usePost.post_edit.series?._id) {
      list.push(usePost.post_edit.series);
    } else list.push(e);
  });
  return list;
});

const emit = defineEmits(["save"]);

function getdata() {
  usePost.post_edit.author = useUser.user;
  usePost.post_edit.status = selectStatus.value;
  usePost.post_edit.content = quill.value.getContents();
  usePost.post_edit.team = useTeam.team;
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
  await useSeries.findByUserTeam(useAuth.user.id, route.params.id);
  await useStatus.findAll();
  await useTeam.findOneEdit(route.params.id);
}

onMounted(() => {
  useSeries.reset();
  useTeam.reset();
  getApi();
});

onUnmounted(() => {
  useSeries.reset();
  useTeam.reset();
});
</script>

<style></style>
