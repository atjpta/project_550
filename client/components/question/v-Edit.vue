<template>
  <div :class="preview
      ? 'bg-base-100'
      : 'bg-gradient-to-r from-warning/5 via-warning/5 to-pink-500/0'
    " class="p-5 rounded-2xl">
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center">Chỉnh sửa câu hỏi</div>
        <!-- tiêu đề -->
        <div class="">
          <div class="text-2xl mt-5">
            Tiêu đề
            <div class="tooltip" data-tip="Không được để trống">
              <div class="btn-xs btn btn-ghost rounded-full h-1 w-6">
                <OtherVIcon class-icon="text-error" icon="fa-solid fa-star-of-life" />
              </div>
            </div>
          </div>
          <input @blur="checkTitle()" v-model="useQuestion.question_edit.title" placeholder="Nhập tiêu đề..." type="text"
            class="input input-primary w-full" />
        </div>
        <div class="">
          <div v-if="showSearch && useSearch.data.length > 0" class="bg-base-100/50 flex-col indicator w-full">
            <div class="text-center text-2xl mt-3">Gợi ý một số câu hỏi liên quan</div>
            <div class="indicator-item indicator-end mt-5 mr-5">
              <div @click="showSearch = false" class="btn btn-ghost btn-sm btn-square">
                <OtherVIcon class-icon="text-2xl" icon="fa-solid fa-square-xmark" />
              </div>
            </div>
            <div class="w-full max-h-[50vh] overflow-y-auto">
              <div class="w-full" v-for="(i, n) in useSearch.data" :key="i.id">
                <SearchVMonoQ2 @click="navigateTo(`/question/${i.id}`)" class="hover:bg-base-200 cursor-pointer"
                  :data="i" />
                <div v-if="n < useSearch.data.length - 1" class="divider my-0 mx-5"></div>
              </div>
            </div>
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
          <TagVInputTag :data="useQuestion.question_edit.tag" />
        </div>

        <!-- phần chọn mon học -->
        <div>
          <div class="text-2xl mt-5 mb-2">
            Môn học
            <!-- <div class="tooltip" data-tip="Cần có chuỗi bài viết trước">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div> -->
          </div>
          <select v-model="useQuestion.question_edit.course" class="select-sm select select-primary w-full max-w-xs">
            <option :value="{}">Không có</option>
            <option :value="i" v-for="i in useCourse.list" :key="i">
              {{ i.name }}
            </option>
          </select>
        </div>
        <!-- phần chọn serise -->
        <div>
          <div class="text-2xl mt-5 mb-2">
            Chủ đề
            <div class="tooltip" data-tip="Cần có chủ đề câu hỏi trước">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <select v-model="useQuestion.question_edit.topic" class="select-sm select select-primary w-full max-w-xs">
            <option :value="{}">Không có</option>
            <option :value="i" v-for="i in list_topic" :key="i">
              {{ i.name }}
            </option>
          </select>
        </div>
        <nuxt-link to="/topic/edit">
          <div class="btn btn-ghost btn-xs italic lowercase">Tạo chủ đề câu hỏi mới?</div>
        </nuxt-link>
        <!-- phần chọn team -->

        <div>
          <div class="text-2xl mt-5 mb-2">
            Nhóm
            <div class="tooltip" data-tip="Cần tham gia nhóm trước">
              <div class="btn-xs btn btn-info btn-outline rounded-full h-1 w-6">
                <OtherVIcon class-icon="" icon="fa-solid fa-info" />
              </div>
            </div>
          </div>
          <select v-model="useQuestion.question_edit.team" class="select-sm select select-primary w-full max-w-xs">
            <option :value="{}">Chung</option>
            <option :value="i" v-for="i in useTeam.List_team_ByUser" :key="i">
              {{ i.name }}
            </option>
          </select>
        </div>

        <!-- chọn trang thái -->

        <div class="text-2xl mt-5 mb-2">Chọn trạng thái</div>
        <div class="w-full max-w-xs">
          <div data-tip="Mọi người đều xem được câu hỏi" class="form-control tooltip w-full">
            <label class="label cursor-pointer">
              <span class="label-text">Công khai</span>
              <input @click="useQuestion.question_edit.status = 'public'" type="radio" name="radio-10"
                class="radio checked:bg-red-500" :checked="useQuestion.question_edit.status == 'public'" />
            </label>
          </div>
          <div data-tip="Câu hỏi chỉ có bạn thấy được" class="form-control tooltip w-full">
            <label class="label cursor-pointer">
              <span class="label-text">Riêng tư</span>
              <input :checked="useQuestion.question_edit.status == 'private'"
                @click="useQuestion.question_edit.status = 'private'" type="radio" name="radio-10"
                class="radio checked:bg-blue-500" />
            </label>
          </div>
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
          <QuillEditor class="min-h-[30vh]" :modules="modules" placeholder="Nhập nội dung..." ref="quill" theme="snow"
            toolbar="full" />
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
      <div v-if="preview == false" @click="showPreview()" class="btn btn-outline btn-sm btn-info">
        Xem trước
      </div>
      <div v-if="preview == true" @click="preview = false" class="btn btn-outline btn-sm btn-info">
        Chỉnh tiếp
      </div>
      <div @click="save()" :class="[loading ? 'loading' : '']" class="btn btn-sm btn-primary">
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
import { teamStore } from "~~/stores/team.store";
import { topicStore } from "~~/stores/topic.store";
import { authStore } from "~~/stores/auth.store";
import { statusStore } from "~~/stores/status.store";
import { questionStore } from "~~/stores/question.store";
import ImageUploader from "quill-image-uploader";
import config from "~~/config";
import axios from "axios";
import { alertStore } from "~/stores/alert.store";
import { courseStore } from "~/stores/course.store";
import { searchStore } from "~/stores/search.store";
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
const useCourse = courseStore();
const useUser = userStore();
const useAuth = authStore();
const useTeam = teamStore();
const useTopic = topicStore();
const useQuestion = questionStore();
const route = useRoute();
const useAlert = alertStore();
const showSearch = ref(false);
const useSearch = searchStore();
const list_topic = computed(() => {
  if (!useQuestion.question_edit.topic) {
    useQuestion.question_edit.topic = {};
  }
  let list = [];
  useTopic.List_topic2.forEach((e) => {
    if (e.team) {
      useTeam.List_team_ByUser.forEach((ee) => {
        if (e.team._id == ee._id) {
          if (e.id == useQuestion.question_edit.topic?._id) {
            list.push(useQuestion.question_edit.topic);
          } else list.push(e);
        }
      });
    } else {
      if (e.id == useQuestion.question_edit.topic?._id) {
        list.push(useQuestion.question_edit.topic);
      } else list.push(e);
    }
  });

  return list;
});

let old = {};
const list_team = computed(() => {
  let list = [];
  if (useQuestion.question_edit.topic?.name) {
    if (useQuestion.question_edit.topic.team?.name) {
      list.push(useQuestion.question_edit.topic.team);
      useQuestion.question_edit.team = {
        name: useQuestion.question_edit.topic.team.name,
        id: useQuestion.question_edit.topic.team._id,
      };
    } else {
      list = [];
      useQuestion.question_edit.team = {};
    }
  } else {
    list = useTeam.List_team_ByUser;
    if (!useQuestion.question_edit.team?.name) {
      useQuestion.question_edit.team = {};
    } else if (useQuestion.question_edit.team == old) {
      useQuestion.question_edit.team = {};
    }
  }
  old = useQuestion.question_edit.team;
  return list;
});

const emit = defineEmits(["save"]);

function getdata() {
  useQuestion.question_edit.author = useUser.user;
  useQuestion.question_edit.content = quill.value.getContents();
  useQuestion.question_edit.contentOnlyText = quill.value.getText();
}

async function checkTitle() {
  showSearch.value = true;
  try {
    await useSearch.search(useQuestion.question_edit.title);
  } catch (error) {
    console.log(error);
  }
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
  if (route.params.id) {
    await useQuestion.findOneEdit(route.params.id);
    if (useQuestion.question.author._id != useAuth.user.id) {
      useAlert.setWarning("bạn Không có quyền truy cập");
      return navigateTo("/");
    }
    useQuestion.question_edit = useQuestion.question;

    if (useQuestion.question_edit.course) {
      useCourse.list.forEach((e, i) => {
        if (e.id == useQuestion.question_edit.course._id) {
          useCourse.list[i] = useQuestion.question_edit.course;
        }
      });
    } else {
      useQuestion.question_edit.course = {};
    }
    setContent();
  } else {
    useQuestion.resetQuestionEdit();
    if (useQuestion.title) {
      useQuestion.question_edit.title = useQuestion.title;
      checkTitle();
    }
  }
}

onMounted(() => {
  useTopic.reset();
  useTeam.reset();
  useTeam.findByUser(useAuth.user.id);
  useTopic.getEdit();
  useCourse.findAll();
  getApi();
});

onUnmounted(() => {
  useTopic.reset();
  useTeam.reset();
  if (useQuestion.question_edit?.title) {
    useQuestion.title = useQuestion.question_edit.title;
  }
});
</script>

<style></style>
