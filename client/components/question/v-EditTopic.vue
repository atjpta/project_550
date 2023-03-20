<template>
  <div
    :class="
      preview
        ? 'bg-base-100'
        : 'bg-gradient-to-r from-warning/5 via-warning/5 to-pink-500/0'
    "
    class="p-5 rounded-2xl"
  >
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-semibold">Chỉnh sửa câu hỏi</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-semibold mt-5">
            Tiêu đề
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <input
            v-model="useQuestion.question_edit.title"
            placeholder="nhập tiêu đề"
            type="text"
            class="input input-primary w-full"
          />
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
          <TagVInputTag :data="useQuestion.question_edit.tag" />
        </div>

        <!-- chọn trạng thái -->
        <div>
          <div class="text-xl font-semibold mt-5 mb-2">
            Chọn trạng thái bài viết
            <div class="tooltip" data-tip="riêng tư là chỉ bạn có thể thấy">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <select
            v-model="selectStatus"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option :value="i" v-for="i in list_status" :key="i">
              {{ i.name == "public" ? "Công khai" : "Riêng tư" }}
            </option>
          </select>
        </div>

        <!-- phần nội dung bài viết -->
        <div class="flex justify-between mt-5 mb-2">
          <div class="text-xl font-semibold mt-5">
            Nội dung
            <div class="tooltip" data-tip="không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
        </div>

        <div class="-z-10">
          <QuillEditor
            :modules="modules"
            placeholder="nhập nội dung"
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
        <QuestionVPreviewqestion :data="useQuestion.question_edit" />
      </div>
    </transition>
    <!-- các nút btn -->
    <div class="flex justify-end space-x-5 my-5">
      <div
        v-if="preview == false"
        @click="showPreview()"
        class="btn btn-outline btn-sm btn-info"
      >
        xem trước
      </div>
      <div
        v-if="preview == true"
        @click="preview = false"
        class="btn btn-outline btn-sm btn-info"
      >
        chỉnh tiếp
      </div>
      <div
        @click="save()"
        :class="[loading ? 'loading' : '']"
        class="btn btn-outline btn-sm btn-primary"
      >
        lưu
      </div>
      <div @click="useRouter().back()" class="btn btn-outline btn-sm btn-error">hủy</div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor, Quill } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "@vueup/vue-quill/dist/vue-quill.bubble.css";
import { userStore } from "~~/stores/user.store";
import { teamStore } from "~~/stores/team.store";
import { topicStore } from "~~/stores/topic.store";
import { authStore } from "~~/stores/auth.store";
import { statusStore } from "~~/stores/status.store";
import { questionStore } from "~~/stores/question.store";
import ImageUploader from "quill-image-uploader";
import config from "~~/config";
import axios from "axios";
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
});
const quill = ref();
const preview = ref(false);

const useUser = userStore();
const useAuth = authStore();
const useStatus = statusStore();
const useTeam = teamStore();
const useTopic = topicStore();
const useQuestion = questionStore();
const route = useRoute();
const selectStatus = ref();
const list_status = computed(() => {
  if (!selectStatus.value) {
    useStatus.getPost.forEach((e) => {
      if (e.name == "public") {
        selectStatus.value = e;
      }
    });
  }
  return useStatus.getPost;
});

const emit = defineEmits(["save"]);

function getdata() {
  useQuestion.question_edit.author = useUser.user;
  useQuestion.question_edit.status = selectStatus.value;
  useQuestion.question_edit.content = quill.value.getContents();
  useQuestion.question_edit.team = useTopic.topic.team[0] ?? {};
  useQuestion.question_edit.topic = {
    id: useTopic.topic._id,
    name: useTopic.topic.name,
  };
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
  quill.value.setContents(useQuestion.question_edit.content);
};

async function getApi() {
  await useTopic.findOne(route.params.id);
  await useStatus.findAll();
}

onMounted(() => {
  getApi();
});

onUnmounted(() => {
  useTopic.reset();
  useTeam.reset();
});
</script>

<style></style>
