<template>
  <div class="p-5 bg-base-200 rounded-2xl">
    <transition name="bounce">
      <div v-show="preview == false">
        <div class="text-4xl text-center font-semibold">Chỉnh sửa bài viết</div>

        <!-- tiêu đề -->
        <div>
          <div class="text-xl font-semibold mt-5">Tiêu đề</div>
          <input
            v-model="data.title"
            placeholder="nhập tiêu đề"
            type="text"
            class="p-1 bg-inherit border-0 border-b-2 border-primary w-full"
          />
        </div>

        <!-- ảnh bìa -->
        <div class="text-xl font-semibold mt-5">
          Ảnh bìa cho bài viết
          <div>
            <ImageVUploadsimple />
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
          <TagVTag v-model:data="data_tag" />
        </div>
        <!-- phần chọn serise -->
        <div>
          <div class="text-xl font-semibold mt-5 mb-2">Chọn chuỗi bài viết của bạn</div>
          <select
            v-model="select_series"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option :value="{}">Không có</option>
            <option :value="i" v-for="i in useSeries.List_series_ByUser" :key="i">
              {{ i.name }}
            </option>
          </select>
        </div>
        <div class="btn btn-ghost btn-xs italic lowercase">tạo 1 chuỗi bài viết mới?</div>

        <div>
          <div class="text-xl font-semibold mt-5 mb-2">Chọn nhóm muốn đăng</div>
          <select
            v-model="select_team"
            v-if="!select_series.team && list_team.length != 0"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option :value="{}">Chung</option>
            <option :value="i" v-for="i in list_team" :key="i">{{ i.name }}</option>
          </select>
          <select
            disabled
            v-if="select_series.team || list_team.length == 0"
            class="select-sm select select-primary w-full max-w-xs"
          >
            <option v-if="list_team.length == 0">Chung</option>
            <option v-if="list_team.length == 1">
              {{ list_team[0].name }}
            </option>
          </select>
        </div>

        <!-- phần nội dung bài viết -->
        <div class="flex justify-between mt-5 mb-2">
          <div class="text-xl font-semibold">Nội dung</div>
        </div>

        <div class="-z-10">
          <QuillEditor ref="quill" theme="snow" toolbar="full" />
        </div>
      </div>
    </transition>
    <!-- preview -->
    <transition name="bounce">
      <div v-show="preview == true">
        <PostVPost :data="data" />
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
      <div class="btn btn-outline btn-sm btn-primary">lưu</div>
      <div class="btn btn-outline btn-sm btn-error">hủy</div>
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
const quill = ref();
const preview = ref(false);
const useTeam = teamStore();
const useSeries = seriesStore();
const select_series = ref({});
const select_team = ref({});
const props = defineProps({
  data: Object,
});

const data_tag = ref([]);
const list_team = computed(() => {
  let list = [];
  if (select_series.value.id) {
    if (select_series.value.team) {
      list.push(select_series.value.team);
      select_team.value = select_series.value.team;
    } else {
      list = [];
      select_team.value = {};
    }
  } else list = useTeam.List_team_ByUser;
  return list;
});

const useUser = userStore();
const useAuth = authStore();
const useImage = imageStore();
function getdata() {
  props.data.image_cover = useImage.previewImage;
  props.data.tag = data_tag.value;
  props.data.team = select_team.value;
  props.data.series = select_series.value;
  props.data.author = useUser.user;
  getContent();
}
function showPreview() {
  preview.value = true;
  getdata();
}

function getContent() {
  props.data.content = quill.value.getContents();
}

onMounted(() => {
  useTeam.findByUser(useAuth.user.id);
  useSeries.findByUser(useAuth.user.id);
});
</script>

<style>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
