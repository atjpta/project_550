<template>
  <div class="p-5 bg-base-200 rounded-2xl">
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-semibold">Chỉnh sửa câu hỏi</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-semibold mt-5">Tiêu đề</div>
          <input
            v-model="useQuestion.question_edit.title"
            placeholder="nhập tiêu đề"
            type="text"
            class="input bg-inherit border-0 border-b-2 border-primary w-full"
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
          <TagVTag :data="useQuestion.question_edit.tag" />
        </div>
        <!-- phần chọn serise -->
        <div>
          <div class="text-xl font-semibold mt-5 mb-2">
            Chọn chủ đề câu hỏi
            <div class="tooltip" data-tip="cần có chuỗi bài viết trước">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <select
            v-model="useQuestion.question_edit.topic"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option :value="{}">Không có</option>
            <option :value="i" v-for="i in list_topic" :key="i">
              {{ i.name }}
            </option>
          </select>
        </div>
        <nuxt-link to="/topic/edit">
          <div class="btn btn-ghost btn-xs italic lowercase">tạo chủ đề câu hỏi mới?</div>
        </nuxt-link>

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
          <div class="text-xl font-semibold">Nội dung</div>
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
      <div @click="this.$router.back()" class="btn btn-outline btn-sm btn-error">hủy</div>
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
const url = config.url.apiimage;
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

const list_topic = computed(() => {
  useQuestion.question_edit.topic = {};
  return useTopic.List_topic;
});
const emit = defineEmits(["save"]);

function getdata() {
  useQuestion.question_edit.author = useUser.user;
  useQuestion.question_edit.status = selectStatus.value;
  useQuestion.question_edit.content = quill.value.getContents();
  useQuestion.question_edit.team = useTopic.List_topic[0].team;
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
  await useTopic.findByUserTeam(useAuth.user.id, route.params.id);
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
