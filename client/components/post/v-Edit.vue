<template>
  <div :class="preview
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
          <input @blur="!data.title
              ? (checkTitle = 'không được để tiêu đề trống')
              : (checkTitle = '')
            " v-model="data.title" placeholder="nhập tiêu đề" type="text" class="input input-primary w-full" />
          <!-- <div class="text-error italic">
            {{ checkTitle }}
          </div> -->
        </div>

        <!-- ảnh bìa -->
        <div class="text-xl font-extrabold mt-5">
          Ảnh bìa cho bài viết
          <div>
            <ImageVUploadsimple :data="data.image_cover_url" />
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
          <TagVInputTag :data="data.tag" />
        </div>

        <!-- phần chọn mon học -->
        <div>
          <div class="text-xl font-extrabold mt-5 mb-2">
            Chọn môn học
            <!-- <div class="tooltip" data-tip="cần có chuỗi bài viết trước">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div> -->
          </div>
          <select v-model="data.course" class="select-sm select select-primary w-full max-w-xs">
            <option :value="{}">Không có</option>
            <option :value="i" v-for="i in useCourse.list" :key="i">
              {{ i.name }}
            </option>
          </select>
        </div>
        <div>
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
            <select v-model="data.series" class="select-sm select select-primary w-full max-w-xs">
              <option :value="{}">Không có</option>
              <option :value="i" v-for="i in useSeries.List_series_ByUser" :key="i">
                {{ i.name }}
              </option>
            </select>
          </div>
          <nuxt-link to="/series/edit">
            <div class="btn btn-ghost btn-xs italic lowercase">
              tạo chuỗi bài viết mới?
            </div>
          </nuxt-link>

          <!-- phần chọn nhóm -->
          <div>
            <div class="text-xl font-extrabold mt-5 mb-2">
              Chọn nhóm
              <div class="tooltip" data-tip="cần có nhóm trước">
                <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                  <OtherVIcon class-icon="" icon="fa-solid fa-info" />
                </div>
              </div>
            </div>
            <select v-model="data.team" class="select-sm select select-primary w-full max-w-xs">
              <option :value="{}">Không có</option>
              <option :value="i" v-for="i in useTeam.List_team_ByUser" :key="i">
                {{ i.name }}
              </option>
            </select>
          </div>
          <nuxt-link to="/team">
            <div class="btn btn-ghost btn-xs italic lowercase">tham gia nhóm mới?</div>
          </nuxt-link>

          <!-- chọn trang thái -->

          <div class="text-xl font-extrabold mt-5 mb-2">Chọn trạng thái</div>
          <div class="w-full max-w-xs">
            <div data-tip="mọi người đều xem được bài viết" class="form-control tooltip w-full">
              <label class="label cursor-pointer">
                <span class="label-text">công khai</span>
                <input @click="data.status = 'public'" type="radio" name="radio-10" class="radio checked:bg-red-500"
                  :checked="data.status == 'public'" />
              </label>
            </div>
            <div data-tip="bài viết chỉ có bạn thấy được" class="form-control tooltip w-full">
              <label class="label cursor-pointer">
                <span class="label-text">riêng tư</span>
                <input :checked="data.status == 'private'" @click="data.status = 'private'" type="radio" name="radio-10"
                  class="radio checked:bg-blue-500" />
              </label>
            </div>
          </div>
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
        {{ checkContent }}
        <div class="min-h-[30vh]">
          <QuillEditor class="min-h-[30vh]" :modules="modules" placeholder="nhập nội dung" ref="quill" theme="snow"
            toolbar="full" />
        </div>
      </div>
    </transition>
    <!-- preview -->
    <transition name="bounce">
      <div class="" v-show="preview == true">
        <PostVPreviewpost :data="data" />
      </div>
    </transition>
    <!-- các nút btn -->
    <div class="flex justify-end space-x-3 my-5">
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
import { alertStore } from "~/stores/alert.store";
import { courseStore } from "~/stores/course.store";
const supabase = useSupabaseClient();

const url = config.url.apiimage;
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
  data: Object,
});
const quill = ref();
const preview = ref(false);

const checkTitle = ref();
const checkContent = ref();

const useUser = userStore();
const useAuth = authStore();
const useStatus = statusStore();
const useImage = imageStore();
const useTeam = teamStore();
const useSeries = seriesStore();
const usePost = postStore();
const route = useRoute();
const useAlert = alertStore();
const selectStatus = ref();
const useCourse = courseStore();

const emit = defineEmits(["save"]);

function getdata() {
  props.data.author = useUser.user;
  props.data.content = quill.value.getContents();
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
  quill.value.setContents(props.data.content);
};
let times = 0;
watch(props, () => {
  if (props.data.content && times == 0) {
    times = 1;
    setContent();
  }
});

async function getApi() {
  useCourse.findAll();
  useTeam.findByUser(useAuth.user.id);
  useSeries.findByUser(useAuth.user.id);
}

onMounted(() => {
  getApi();
});

onUnmounted(() => { });
</script>

<style></style>
