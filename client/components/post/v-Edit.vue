<template>
  <div class="p-5 bg-base-200 rounded-2xl">
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-semibold">Chỉnh sửa bài viết</div>
        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-semibold mt-5">Tiêu đề</div>
          <input
            v-model="usePost.post_edit.title"
            placeholder="nhập tiêu đề"
            type="text"
            class="p-1 bg-inherit border-0 border-b-2 border-primary w-full"
          />
        </div>

        <!-- ảnh bìa -->
        <div class="text-xl font-semibold mt-5">
          Ảnh bìa cho bài viết
          <div>
            <ImageVUploadsimple :data="usePost.post_edit.image_cover_url" />
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
          <TagVTag v-model:data="usePost.post_edit.tag" />
        </div>
        <!-- phần chọn serise -->
        <div>
          <div class="text-xl font-semibold mt-5 mb-2">Chọn chuỗi bài viết của bạn</div>
          <select
            v-model="usePost.post_edit.series"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option :value="{}">Không có</option>
            <option :value="i" v-for="i in list_series" :key="i">
              {{ i.name }}
            </option>
          </select>
        </div>
        <div class="btn btn-ghost btn-xs italic lowercase">tạo 1 chuỗi bài viết mới?</div>
        <!-- phần chọn team -->

        <div>
          <div class="text-xl font-semibold mt-5 mb-2">Chọn nhóm muốn đăng</div>
          <select
            v-model="usePost.post_edit.team"
            v-if="!usePost.post_edit.series.team && list_team.length != 0"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option :value="{}">Chung</option>
            <option :value="i" v-for="i in list_team" :key="i">{{ i.name }}</option>
          </select>
          <select
            disabled
            v-if="usePost.post_edit.series.team || list_team.length == 0"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option v-if="list_team.length == 0">Chung</option>
            <option v-if="list_team.length == 1">
              {{ list_team[0].name }}
            </option>
          </select>
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
            v-model="usePost.post_edit.status"
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
        <PostVPost :data="usePost.post_edit" />
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
import { seriesStore } from "~~/stores/series.store";
import { authStore } from "~~/stores/auth.store";
import { imageStore } from "~~/stores/image.store";
import { statusStore } from "~~/stores/status.store";
import { postStore } from "~~/stores/post.store";

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
const list_status = computed(() => {
  useStatus.getPost.forEach((e) => {
    if (e.name == "public") {
      usePost.post_edit.status = e;
    }
  });
  return useStatus.getPost;
});

const list_series = computed(() => {
  let list = [];
  useSeries.List_series_ByUser.forEach((e) => {
    if (e.id == usePost.post_edit.series._id) {
      list.push(usePost.post_edit.series);
    } else list.push(e);
  });
  return list;
});

const list_team = computed(() => {
  let list = [];
  if (usePost.post_edit.series.name) {
    if (usePost.post_edit.series.team) {
      list.push(usePost.post_edit.series.team);
      usePost.post_edit.team = {
        name: usePost.post_edit.series.team.name,
        id: usePost.post_edit.series.team._id,
      };
    } else {
      list = [];
      usePost.post_edit.team = {};
    }
  } else list = useTeam.List_team_ByUser;
  return list;
});

const emit = defineEmits(["save"]);

function getdata() {
  usePost.post_edit.author = useUser.user;
  usePost.post_edit.content = quill.value.getContents();
}

function save() {
  getdata();
  emit("save");
}

function showPreview() {
  getdata();
  console.log(usePost.post_edit);
  preview.value = true;
}

const setContent = () => {
  quill.value.setContents(usePost.post_edit.content);
};

async function getApi() {
  if (route.params.id) {
    await usePost.findOne(route.params.id);
    usePost.post_edit = usePost.post;
    setContent();
  } else {
    usePost.resetPostEdit();
  }
}

onMounted(() => {
  useTeam.findByUser(useAuth.user.id);
  useSeries.findByUser(useAuth.user.id);
  useStatus.findAll();
  getApi();
});
</script>

<style></style>
